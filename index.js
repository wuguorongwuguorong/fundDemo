const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');
const { defaultConfiguration } = require('express/lib/application');
const excelJs = require('exceljs')
const XLSX = require('xlsx');


let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts');

// Include the 188 handlebar helpers
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

hbs.registerHelper('ddmmyyyy', function (date) {
    return new Date(date).toLocaleDateString('en-GB'); // dd/mm/yyyy
});

hbs.registerHelper('eq', (a, b) => a == b);


let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

    app.get('/', async function (req, res) {
        res.render('index');

    });

    app.get('/export', async (req, res) => {
        try {


            // Query the data from the 'Overview' table
            const [rows, fields] = await connection.execute('SELECT Customers.cFirst_name, Customers.cLast_name, Customers.cEmail, Banks.bank_name, Pnotes.invest_amt, Pnotes.pstart_date, Agents.aFirst_name, Agents.aLast_name FROM Customers JOIN Pnotes ON Pnotes.cust_id = Customers.cust_id Join Agents ON Pnotes.agent_id = Agents.agent_id join Banks on Pnotes.bank_id = Banks.bank_id');

            // Create a heading for the Excel file
            const heading = [["S/N", "First Name", "Last Name", "Bank", "Invested Amount", "Inception Date", "Agent Name", "Agent Name"]];

            // Convert the rows to a worksheet
            const worksheet = XLSX.utils.json_to_sheet(rows);

            // Add the heading to the worksheet (optional)
            XLSX.utils.sheet_add_aoa(worksheet, heading, { origin: "A1" });

            // Create a new workbook and append the worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Overview');

            // Write the workbook to a buffer
            const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

            // Set response headers to trigger file download
            res.setHeader('Content-Disposition', 'attachment; filename="Overview.xlsx"');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Send the Excel file as a response
            res.send(buffer);

        } catch (error) {
            console.error('Error exporting data:', error);
            res.status(500).send('Error exporting data');
        }
    });

    // Overall summary: per (customer, agent)
// - Total Invested: sum of all pnotes' invest_amt (no date filter)
// - Dividends: 1% per eligible month within [from,to],
//   where eligible start = first of month if pstart<=14, else first of next month.
app.get('/overall/summary', async (req, res, next) => {
  try {
    // default to current month if not provided
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const firstOfMonth = `${yyyy}-${mm}-01`;
    // last day of current month:
    const lastOfMonth = new Date(yyyy, today.getMonth() + 1, 0)
      .toISOString().slice(0,10);

    const from = (req.query.from || firstOfMonth).trim();
    const to   = (req.query.to   || lastOfMonth).trim();

    // Main aggregation: one row per (customer, agent)
    const [rows] = await connection.execute(
      `
      SELECT
        c.cust_id,
        c.cFirst_name,
        c.cLast_name,
        a.agent_id,
        a.aFirst_name,
        a.aLast_name,
        /* All pnotes for this customer-agent, as IDs */
        GROUP_CONCAT(p.pnote_id ORDER BY p.pnote_id SEPARATOR ', ') AS pnote_ids,

        /* Total invested across ALL pnotes for this customer-agent (no date filter) */
        ROUND(SUM(p.invest_amt), 2) AS total_invested,

        /* Dividends for the selected period (1% per eligible month) */
        ROUND(SUM(
          p.invest_amt * 0.01 *
          GREATEST(0,
            TIMESTAMPDIFF(
              MONTH,
              GREATEST(
                /* 15th rule for eligible start */
                CASE
                  WHEN DAY(p.pstart_date) <= 14
                    THEN DATE_FORMAT(p.pstart_date, '%Y-%m-01')
                  ELSE DATE_ADD(DATE_FORMAT(p.pstart_date, '%Y-%m-01'), INTERVAL 1 MONTH)
                END,
                DATE_FORMAT(?, '%Y-%m-01')  /* period start aligned to month */
              ),
              DATE_ADD(
                DATE_FORMAT(LEAST(COALESCE(p.pend_date, ?), ?), '%Y-%m-01'),
                INTERVAL 1 MONTH
              )
            )
          )
        ), 2) AS dividends_amount

      FROM Pnotes p
      JOIN Customers c ON c.cust_id = p.cust_id
      JOIN Agents    a ON a.agent_id = p.agent_id
      GROUP BY
        c.cust_id, c.cFirst_name, c.cLast_name,
        a.agent_id, a.aFirst_name, a.aLast_name
      ORDER BY
        c.cLast_name, c.cFirst_name, a.aLast_name, a.aFirst_name
      `,
      [from, to, to]
    );

    res.render('overall_summary', {
      rows,
      filters: { from, to }
    });
  } catch (err) {
    next(err);
  }
});


    app.get('/banks', async function (req, res) {
        const [banks] = await connection.execute("SELECT * FROM Banks");
        console.log(banks);
        res.render('banks', {
            allBanks: banks
        });
    });

    app.get('/banks', async (req, res, next) => {
        try {
            const [banks] = await connection.execute('SELECT * FROM Banks ORDER BY bank_id DESC');
            res.render('banks', { allBanks: banks });
        } catch (err) { next(err); }
    });

    // Handle Create Bank
    app.post('/banks/create', async (req, res, next) => {
        try {
            const { bank_name, addr_1, addr_2, zipcode, swift_code } = req.body;

            // (optional) basic server-side guard
            if (!bank_name || !addr_1 || !addr_2 || !zipcode || !swift_code) {
                // You could render with an error message instead of redirecting
                return res.redirect('/banks');
            }

            await connection.execute(
                `INSERT INTO Banks (bank_name, addr_1, addr_2, zipcode, swift_code)
       VALUES (?, ?, ?, ?, ?)`,
                [bank_name, addr_1, addr_2, zipcode, swift_code]
            );

            res.redirect('/banks'); // refresh list
        } catch (err) { next(err); }
    });

    // List Agents
    app.get('/agents', async (req, res, next) => {
        try {
            const [agents] = await connection.execute(`
      SELECT
        agent_id,
        aFirst_name,
        aLast_name,
        aEmail,
        DATE_FORMAT(join_date, '%d/%m/%Y') AS join_date_fmt
      FROM Agents
      ORDER BY agent_id ASC
    `);
            res.render('agents', { allAgents: agents });
        } catch (err) { next(err); }
    });

    // Create Agent
    app.post('/agents/create', async (req, res, next) => {
        try {
            let { aFirst_name, aLast_name, aEmail, join_date } = req.body;

            // Basic guard
            if (!aFirst_name || !aLast_name || !aEmail || !join_date) {
                return res.redirect('/agents');
            }

            // Convert HTML datetime-local ("YYYY-MM-DDTHH:MM") to MySQL DATETIME ("YYYY-MM-DD HH:MM:SS")
            // Safe fallback if seconds are missing.
            join_date = join_date.replace('T', ' ');
            if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(join_date)) {
                join_date = `${join_date}:00`;
            }

            await connection.execute(
                `INSERT INTO Agents (aFirst_name, aLast_name, aEmail, join_date)
       VALUES (?, ?, ?, ?)`,
                [aFirst_name, aLast_name, aEmail, join_date]
            );

            res.redirect('/agents');
        } catch (err) { next(err); }
    });

    app.get('/agents/:id/edit', async (req, res, next) => {
        try {
            const [rows] = await connection.execute(
                `SELECT
         agent_id, aFirst_name, aLast_name, aEmail,
         DATE_FORMAT(join_date, '%Y-%m-%d') AS join_date_iso
       FROM Agents
       WHERE agent_id = ?`,
                [req.params.id]
            );
            if (!rows.length) return res.status(404).send('Agent not found');
            res.render('agent_edit', { agent: rows[0] });
        } catch (err) { next(err); }
    });

    app.post('/agents/:id/edit', async (req, res, next) => {
        try {
            const { aFirst_name, aLast_name, aEmail, join_date } = req.body;

            // join_date from <input type="date"> is YYYY-MM-DD — convert to DATETIME:
            const joinDateTime = `${join_date} 00:00:00`;

            await connection.execute(
                `UPDATE Agents
       SET aFirst_name = ?, aLast_name = ?, aEmail = ?, join_date = ?
       WHERE agent_id = ?`,
                [aFirst_name, aLast_name, aEmail, joinDateTime, req.params.id]
            );

            res.redirect('/agents');
        } catch (err) { next(err); }
    });

    app.post('/agents/:id/delete', async (req, res, next) => {
        try {
            await connection.execute(`DELETE FROM Agents WHERE agent_id = ?`, [req.params.id]);
            res.redirect('/agents');
        } catch (err) {
            // If there are Pnotes referencing this agent, FK will block deletion.
            // MySQL error code for FK constraint is usually ER_ROW_IS_REFERENCED_2 (1451).
            if (err && err.errno === 1451) {
                // You can render a friendly message or redirect with a query flag.
                console.error('Delete blocked by foreign key (Pnotes referencing this agent).');
                return res.status(400).send('Cannot delete: agent is referenced by existing Pnotes.');
            }
            next(err);
        }
    });


    app.get('/overallView', async function (req, res) {
        let query = `SELECT Customers.cFirst_name, Customers.cLast_name, Customers.cEmail, Banks.bank_name, Pnotes.invest_amt, Pnotes.pstart_date, Agents.aFirst_name, Agents.aLast_name FROM Customers JOIN Pnotes ON Pnotes.cust_id = Customers.cust_id Join Agents ON Pnotes.agent_id = Agents.agent_id join Banks on Pnotes.bank_id = Banks.bank_id WHERE 1=1 `;

        const bindings = [];

        // extract search terms
        const { cFirst_name, cLast_name } = req.query;
        if (cFirst_name) {
            query += ` AND cFirst_name LIKE ?`;
            bindings.push('%' + cFirst_name + '%')
        }
        if (cLast_name) {
            query += ` AND cLast_name LIKE ?`;
            bindings.push('%' + cLast_name + '%');
        }
        console.log("query", query);
        // const [customers] = await connection.execute({
        //     'sql': query,
        //     'nestTables': true
        // }, bindings);

        const [customers] = await connection.execute(query, bindings);
        //let [customers] = await connection.execute('SELECT * FROM Customers Inner JOIN Pnotes ON Customers.cust_id = Pnotes.cust_id');

        res.render('overallView', {
            "allCustomers": customers,
            "searchTerms": req.query
        })
    })

    app.get('/customers', async function (req, res) {
        const [customers] = await connection.execute("SELECT * FROM Customers")
        console.log(customers);
        res.render('customers', {
            "allCustomers": customers,
        });
    })

    //add new customers into database and display in a new page
   app.get('/customers', async (req, res, next) => {
  try {
    const [rows] = await connection.execute(`
      SELECT 
        c.cust_id, c.cFirst_name, c.cLast_name, c.cEmail,
        c.dob, c.NRIC, c.gender, c.addr_1, c.addr_2, c.zipcode,
        c.bank_num, c.bank_id,
        b.bank_name
      FROM Customers c
      LEFT JOIN Banks b ON b.bank_id = c.bank_id
      ORDER BY c.cust_id ASC
    `);

    res.render('customers', {
      allCustomers: rows
    });
  } catch (err) {
    next(err);
  }
});

// Customers create (GET) – fetch Banks for the dropdown
app.get('/customers/create', async (req, res, next) => {
  try {
    const [banks] = await connection.execute(
      `SELECT bank_id, bank_name FROM Banks ORDER BY bank_name ASC`
    );

    res.render('customer_create', {
      banks // pass to HBS to build <select>
    });
  } catch (err) {
    next(err);
  }
});

app.post('/customers/create', async (req, res, next) => {
  try {
    const {
      cFirst_name, cLast_name, dob, NRIC, gender,
      addr_1, addr_2, zipcode, cEmail, bank_num, bank_id
    } = req.body;

    await connection.execute(
      `INSERT INTO Customers
       (cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail, bank_num, bank_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail, bank_num, bank_id]
    );

    res.redirect('/customers');
  } catch (err) {
    next(err);
  }
});


    //update customers page
   app.get('/customers/:id/edit', async (req, res, next) => {
  try {
    const custId = req.params.id;

    // fetch customer (dob formatted for <input type="date">)
    const [custRows] = await connection.execute(`
      SELECT 
        cust_id, cFirst_name, cLast_name, 
        DATE_FORMAT(dob, '%Y-%m-%d') AS dob_iso,
        NRIC, gender, addr_1, addr_2, zipcode, cEmail,
        bank_num, bank_id
      FROM Customers
      WHERE cust_id = ?
    `, [custId]);

    if (!custRows.length) return res.status(404).send('Customer not found');

    // fetch banks for dropdown
    const [banks] = await connection.execute(`
      SELECT bank_id, bank_name FROM Banks ORDER BY bank_name ASC
    `);

    res.render('customer_edit', { customer: custRows[0], banks });
  } catch (err) { next(err); }
});

    app.post('/customers/:id/edit', async (req, res, next) => {
  try {
    const custId = req.params.id;
    const {
      cFirst_name, cLast_name, dob, NRIC, gender,
      addr_1, addr_2, zipcode, cEmail, bank_num, bank_id
    } = req.body;

    await connection.execute(`
      UPDATE Customers
      SET cFirst_name = ?, cLast_name = ?, dob = ?, NRIC = ?, gender = ?,
          addr_1 = ?, addr_2 = ?, zipcode = ?, cEmail = ?, bank_num = ?, bank_id = ?
      WHERE cust_id = ?
    `, [
      cFirst_name, cLast_name, dob, NRIC, gender,
      addr_1, addr_2, zipcode, cEmail, bank_num, bank_id, custId
    ]);

    res.redirect('/customers');
  } catch (err) { next(err); }
});

app.post('/customers/:id/delete', async (req, res, next) => {
  try {
    await connection.execute(`DELETE FROM Customers WHERE cust_id = ?`, [req.params.id]);
    res.redirect('/customers');
  } catch (err) {
    // FK constraint error (row referenced by Pnotes)
    if (err && err.errno === 1451) {
      return res.status(400).send('Cannot delete: customer is referenced by existing Pnotes.');
    }
    next(err);
  }
});

  

    // List Pnotes with Customer, Agent, and Bank info
app.get('/pnotes', async (req, res, next) => {
  try {
    const [pnotes] = await connection.execute(`
      SELECT
        p.pnote_id,
        DATE_FORMAT(p.pstart_date, '%d/%m/%Y') AS pstart_date_fmt,
        CASE WHEN p.pend_date IS NULL THEN '-' ELSE DATE_FORMAT(p.pend_date, '%d/%m/%Y') END AS pend_date_fmt,
        p.invest_amt,
        p.maintenance_fee,
        c.cust_id, c.cFirst_name, c.cLast_name,
        a.agent_id, a.aFirst_name, a.aLast_name,
        b.bank_id, b.bank_name
      FROM Pnotes p
      JOIN Customers c ON c.cust_id = p.cust_id
      JOIN Agents a    ON a.agent_id = p.agent_id
      LEFT JOIN Banks b ON b.bank_id = c.bank_id
      ORDER BY p.pnote_id DESC
    `);

    res.render('pnotes', { allPnotes: pnotes });
  } catch (err) { next(err); }
});

// Show create form (needs customers & agents for dropdowns)
app.get('/pnotes/create', async (req, res, next) => {
  try {
    const [customers] = await connection.execute(`
      SELECT cust_id, CONCAT(cFirst_name, ' ', cLast_name) AS full_name FROM Customers ORDER BY full_name
    `);
    const [agents] = await connection.execute(`
      SELECT agent_id, CONCAT(aFirst_name, ' ', aLast_name) AS full_name FROM Agents ORDER BY full_name
    `);

    res.render('pnote_create', { customers, agents });
  } catch (err) { next(err); }
});


    //Created amd post into database
  app.post('/pnotes/create', async (req, res, next) => {
  try {
    let { cust_id, agent_id, pstart_date, pend_date, invest_amt, maintenance_fee } = req.body;

    // basic guards
    if (!cust_id || !agent_id || !pstart_date || !invest_amt || !maintenance_fee) {
      return res.status(400).send('Missing required fields');
    }

    // normalize pend_date to NULL if empty
    pend_date = pend_date && pend_date.trim() !== '' ? pend_date : null;

    const sql = `
      INSERT INTO Pnotes
        (pstart_date, pend_date, invest_amt, maintenance_fee, cust_id, agent_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(sql, [
      pstart_date, pend_date, invest_amt, maintenance_fee, cust_id, agent_id
    ]);

    res.redirect('/pnotes');
  } catch (err) { next(err); }
});


    //update Pnotes after creatation
    // GET: Edit Pnote
app.get('/pnotes/:id/edit', async (req, res, next) => {
  try {
    const pnoteId = req.params.id;

    // Load the pnote (format dates for <input type="date">)
    const [pRows] = await connection.execute(`
      SELECT
        pnote_id,
        DATE_FORMAT(pstart_date, '%Y-%m-%d') AS pstart_date_iso,
        CASE WHEN pend_date IS NULL THEN NULL ELSE DATE_FORMAT(pend_date, '%Y-%m-%d') END AS pend_date_iso,
        invest_amt,
        maintenance_fee,
        cust_id,
        agent_id
      FROM Pnotes
      WHERE pnote_id = ?
    `, [pnoteId]);

    if (!pRows.length) return res.status(404).send('Pnote not found');
    const pnote = pRows[0];

    // Dropdowns
    const [customers] = await connection.execute(`
      SELECT cust_id, CONCAT(cFirst_name,' ',cLast_name) AS full_name
      FROM Customers
      ORDER BY full_name
    `);
    const [agents] = await connection.execute(`
      SELECT agent_id, CONCAT(aFirst_name,' ',aLast_name) AS full_name
      FROM Agents
      ORDER BY full_name
    `);

    // Render your edit view (expects pnote, customers, agents)
    res.render('pnote_edit', { pnote, customers, agents });
  } catch (err) { next(err); }
});

// POST: Save Pnote edits
app.post('/pnotes/:id/edit', async (req, res, next) => {
  try {
    const pnoteId = req.params.id;
    let {
      cust_id,
      agent_id,
      pstart_date,     // YYYY-MM-DD from <input type="date">
      pend_date,       // optional
      invest_amt,
      maintenance_fee
    } = req.body;

    // basic validation
    if (!cust_id || !agent_id || !pstart_date || !invest_amt || !maintenance_fee) {
      return res.status(400).send('Missing required fields');
    }

    // normalize pend_date to NULL if empty
    pend_date = pend_date && pend_date.trim() !== '' ? pend_date : null;

    await connection.execute(`
      UPDATE Pnotes
      SET
        pstart_date = ?,
        pend_date = ?,
        invest_amt = ?,
        maintenance_fee = ?,
        cust_id = ?,
        agent_id = ?
      WHERE pnote_id = ?
    `, [pstart_date, pend_date, invest_amt, maintenance_fee, cust_id, agent_id, pnoteId]);

    res.redirect('/pnotes');
  } catch (err) { next(err); }
});

// GET /agents/commissions?agent_id=1&from=2025-01-01&to=2025-12-31&rate=3
app.get('/agents/commissions', async (req, res, next) => {
  try {
    const agentId = (req.query.agent_id || '').trim();
    const from = (req.query.from || '').trim();
    const to   = (req.query.to   || '').trim();
    const rate = isNaN(parseFloat(req.query.rate)) ? 3 : Math.max(0, parseFloat(req.query.rate));

    // dropdown options
    const [agents] = await connection.execute(`
      SELECT agent_id, CONCAT(aFirst_name,' ',aLast_name) AS full_name
      FROM Agents
      ORDER BY CASE WHEN agent_id=1 THEN 0 ELSE 1 END, full_name
    `);

    let rows = [];
    let summary = { grand_invest: 0, grand_commission: 0 };

    if (agentId && from && to) {
      const [data] = await connection.execute(
        `
        /* per-customer invested + commission with 15th rule and month-based proration */
        SELECT
          c.cust_id,
          CONCAT(c.cFirst_name,' ',c.cLast_name) AS customer_name,
          ROUND(SUM(p.invest_amt), 2) AS total_invested,
          /* Sum commission across this agent's pnotes for the customer */
          ROUND(SUM(
            p.invest_amt * (?/100.0) *
            (
              /* months_in_period (inclusive) after applying 15th rule + pend_date */
              GREATEST(0,
                TIMESTAMPDIFF(
                  MONTH,
                  GREATEST(
                    /* eligible start: if day<=14 use first of month, else first of next month */
                    CASE
                      WHEN DAY(p.pstart_date) <= 14
                        THEN DATE_FORMAT(p.pstart_date, '%Y-%m-01')
                      ELSE DATE_ADD(DATE_FORMAT(p.pstart_date, '%Y-%m-01'), INTERVAL 1 MONTH)
                    END,
                    DATE_FORMAT(?, '%Y-%m-01')     /* period start month */
                  ),
                  DATE_ADD(
                    DATE_FORMAT(LEAST(COALESCE(p.pend_date, ?), ?), '%Y-%m-01'),
                    INTERVAL 1 MONTH
                  )
                )
              ) / 12.0
            )
          ), 2) AS commission
        FROM Pnotes p
        JOIN Customers c ON c.cust_id = p.cust_id
        WHERE p.agent_id = ?
        GROUP BY c.cust_id, customer_name
        ORDER BY commission DESC, customer_name
        `,
        [rate, from, to, to, agentId]
      );

      rows = data;

      const [tot] = await connection.execute(
        `
        SELECT
          ROUND(SUM(p.invest_amt),2) AS grand_invest,
          ROUND(SUM(
            p.invest_amt * (?/100.0) *
            GREATEST(0,
              TIMESTAMPDIFF(
                MONTH,
                GREATEST(
                  CASE
                    WHEN DAY(p.pstart_date) <= 14
                      THEN DATE_FORMAT(p.pstart_date, '%Y-%m-01')
                    ELSE DATE_ADD(DATE_FORMAT(p.pstart_date, '%Y-%m-01'), INTERVAL 1 MONTH)
                  END,
                  DATE_FORMAT(?, '%Y-%m-01')
                ),
                DATE_ADD(
                  DATE_FORMAT(LEAST(COALESCE(p.pend_date, ?), ?), '%Y-%m-01'),
                  INTERVAL 1 MONTH
                )
              ) / 12.0
            )
          ),2) AS grand_commission
        FROM Pnotes p
        WHERE p.agent_id = ?
        `,
        [rate, from, to, to, agentId]
      );

      summary = {
        grand_invest: tot[0].grand_invest || 0,
        grand_commission: tot[0].grand_commission || 0
      };
    }

    res.render('agent_commissions', {
      agents,
      selectedAgentId: agentId,
      filters: { from, to, rate },
      rows,
      summary
    });
  } catch (err) {
    next(err);
  }
});


//show total AUM and total unique customers
    app.get('/totalAum', async function (req, res) {
        const [total] = await connection.execute("SELECT SUM(p.invest_amt) AS Total_Invested_Amount,COUNT(DISTINCT c.cust_id) AS Unique_Customers FROM Customers c JOIN Pnotes p ON c.cust_id = p.cust_id;")
        console.log(total);
        res.render('totalAum', {
            "totalSum": total[0],
        });
    })

}

main();

app.listen(3000, () => {
    console.log('Server is running')
});

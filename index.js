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
    app.get('/customers/create', async function (req, res) {
        const [customers] = await connection.execute("SELECT * FROM Customers")
        console.log(customers);
        res.render('create_customers', {
            "allCustomers": customers,

        });
    })
    //add new customers into database and display
    app.post('/customers/create', async function (req, res) {
        const { cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail } = req.body;
        const query = "INSERT INTO Customers(cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail) VALUES (? ,?, ?,?,?,?,?,?,?);"
        const results = await connection.execute(query, [cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail]);
        //res.send(results)
        res.redirect('/customers');
    })

    //delete of customers
    app.get('/customers/:customer_id/delete', async function (req, res) {
        try {
            const customer_id = req.params.customer_id;

            const [customers] = await connection.execute("SELECT * FROM Customers WHERE cust_id = ?",
                [customer_id]);
            const customerToDelete = customers[0];
            res.render("delete_customers", {
                'customer': customerToDelete
            })

        } catch (e) {
            res.json(404)
        }
    })
    app.post('/customers/:customer_id/delete', async function (req, res) {
        try {
            const query = "DELETE FROM Customers where cust_id=?";
            await connection.execute(query, [req.params.customer_id]);
            //  res.render('successful_message',{
            //    'happyMessage': 'customer deleted successfully'
            //})
            res.redirect('/customers');
        } catch (e) {
            res.render('error', {
                'errorMessage': 'Unable to delete customer'
            })
        }
    })

    //update customers page
    app.get('/customers/:customer_id/update', async function (req, res) {
        const customer_id = req.params.customer_id;
        const [customers] = await connection.execute("SELECT * FROM Customers WHERE cust_id = ?",
            [customer_id])
        const customer = customers[0];
        res.render('edit_customers', {
            customer,

        })
    })

    app.post('/customers/:customer_id/update', async function (req, res) {
        try {
            const { cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail } = req.body;
            const query = `UPDATE Customers SET cFirst_name= ? , cLast_name = ?, dob =?,NRIC =?,gender =?,addr_1 =?,addr_2 =?,zipcode =?,cEmail =? WHERE cust_id =?`;
            const bindings = [cFirst_name, cLast_name, dob, NRIC, gender, addr_1, addr_2, zipcode, cEmail, req.params.customer_id];
            await connection.execute(query, bindings);
            console.log('Request Body:', req.body);
            console.log('Customer ID:', req.params.customer_id);

            res.redirect('/customers');
        } catch (e) {
            console.log(e)
            res.render('errors', {
                'errorMessage': "Unable to edit customer"
            })
        }
    })

    //show total AUM and total unique customers
    app.get('/totalAum', async function (req, res) {
        const [total] = await connection.execute("SELECT SUM(p.invest_amt) AS Total_Invested_Amount,COUNT(DISTINCT c.cust_id) AS Unique_Customers FROM Customers c JOIN Pnotes p ON c.cust_id = p.cust_id;")
        console.log(total);
        res.render('totalAum', {
            "totalSum": total[0],
        });
    })

    app.get('/pnotes', async function (req, res) {

        const [pnotes] = await connection.execute("SELECT * FROM Pnotes join Customers ON Pnotes.cust_id = Customers.cust_id where 1")
        console.log(pnotes);
        res.render('showPnotes', {
            "allPnotes": pnotes,
        });
    })
    //create pnotes including customer names
    app.get('/pnotes/create', async function (req, res) {
        const [customers] = await connection.execute("SELECT cust_id, cFirst_name, cLast_name FROM Customers")
        console.log(customers);
        res.render('create_pnotes', {
            "customers": customers,
        });
    })

    //Created amd post into database
    app.post('/pnotes/create', async function (req, res) {
        const { pstart_date, invest_amt, maintenance_fee, cust_id } = req.body;
        const query = `Insert into Pnotes (pstart_date, invest_amt, maintenance_fee, cust_id) values(?,?,?,?);`;

        await connection.execute(query, [pstart_date, invest_amt, maintenance_fee, cust_id])
        res.redirect('/pnotes');

    })

    //update Pnotes after creatation
    app.get('/pnotes/:pnote_id/update', async function (req, res) {

        const [customers] = await connection.execute("SELECT * FROM Customers")
        const [pnotes] = await connection.execute(`select * from Pnotes where pnote_id =?`,
            [req.params.pnote_id]
        );
        const pnote = pnotes[0];
        console.log(pnotes)
        res.render('editPnotes', {
            pnote,
            customers
        });
    })

    //After editing, post it back to All Pnotes
    app.post('/pnotes/:pnote_id/update', async function (req, res) {

        const { pstart_date, invest_amt, maintenance_fee, cust_id } = req.body;
        const query = `UPDATE Pnotes SET pstart_date=?, invest_amt=?, maintenance_fee=?, cust_id=? WHERE pnote_id = ?`;
        const bindings = [pstart_date, invest_amt, maintenance_fee, cust_id, req.params.pnote_id];
        await connection.execute(query, bindings);
        res.redirect('/pnotes');
    })

    //create a path to get values of agents comms
    app.get('/calculateComms', async function (req, res) {
        let query = `Select sum(Pnotes.invest_amt * MonthlyComms.comms_base) AS total_comms_paid, sum(Pnotes.invest_amt) AS total_aum, Agents.aFirst_name ,Agents.aLast_name, Pnotes.pstart_date  from Pnotes Join Agents ON Agents.agent_id = Pnotes.agent_id Join MonthlyComms ON MonthlyComms.pnote_id = Pnotes.pnote_id GROUP BY Agents.aFirst_name, Agents.aLast_name, Pnotes.pstart_date`;

        // const bindings = [];

        //extract search terms
        // const { startDate, endDate } = req.query;
        // if (startDate) {

        //     bindings.push(startDate);
        // }
        // if (endDate) {

        //     bindings.push(endDate);
        // }

        const [agentsComms] = await connection.execute(query);
        console.log(query)

        res.render('calculateComms', {
            "allComms": agentsComms,
            // "searchTerms": req.query
        })
    })

}

main();

app.listen(3000, () => {
    console.log('Server is running')
});

const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');


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

    // app.get('/', async function (req, res) {
    //     res.render('customers.hbs');

    // });

    app.get('/overview', async function (req, res) {
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
        

        const [customers] = await connection.execute(query,bindings);

        //let [customers] = await connection.execute('SELECT * FROM Customers Inner JOIN Pnotes ON Customers.cust_id = Pnotes.cust_id');


        res.render('overallView', {
            "allCustomers": customers,
            "searchTerms": req.query
        })
    })

}
main();

app.listen(3000, () => {
    console.log('Server is running')
});

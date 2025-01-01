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

    app.get('/', async function (req, res) {
        res.render('index.hbs');

    });

    app.get('/customers', async function (req, res) {
        let [customers] = await connection.execute('SELECT * FROM Customers Inner JOIN Pnotes ON Customers.cust_id = Pnotes.cust_id');

        // const [customers] = await connection.execute({
        //     'sql': query,
        //     'nestTables': true
        // }, bindings);

        res.render('customers', {
            "allCustomers": customers,
        })
    })

}
main();

app.listen(3000, () => {
    console.log('Server is running')
});

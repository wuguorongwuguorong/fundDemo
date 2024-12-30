const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const { createConnection } = require('mysql2/promise');
const waxOn = require('wax-on');

let app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('./views/layouts');

let connection;

async function main() {
    connection = await createConnection({
        'host': process.env.DB_HOST,
        'user': process.env.DB_USER,
        'database': process.env.DB_NAME,
        'password': process.env.DB_PASSWORD
    })

app.get('/', (req,res) => {
    res.redirect('/base');
   // res.send('Hello, World!');

});

}main();

app.listen(3000, ()=>{
    console.log('Server is running')
});

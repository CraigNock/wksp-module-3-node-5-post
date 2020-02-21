'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');


const PORT = process.env.PORT || 8000;

const {stock, customers} = require('./data/promo')

// order: 'socks',
// size: 'undefined', small, medium, large, extra-large
// givenName: 'fds',
// surname: 'fdsfds',
// email: {},
// address: '3 sfds',
// city: 'fsfes',
// province: 'fsfds',
// postcode: '5',
// country: 'Canada'

const updateData = () => {
    return;
}

//order
const handleOrder = (req, res) => {
    // let {info} = req.body;
    console.log(req.body);
    
    let {order, size, givenName, surname, email, 
        address, city, province, postcode, country} = req.body;

    /// 000 check first

    //check user
    customers.forEach(client => {
        if ((client.givenName === givenName && client.surname === surname) || (client.address === address)){
            res.send({
                status: 'error',
                error: '550'
            });
        };
        if (client.country !== country){
            res.send({
                status: 'error',
                error: '650'
            });
        };
    });
    //check stock
    switch (order) {
        case 'socks':
            if (stock.socks < 1){
                res.send({
                    status: 'error',
                    error: '450'
                });
            }
            break;
        case 'bottle':
            if (stock.bottle < 1){
                res.send({
                    status: 'error',
                    error: '450'
                });
            }
            break;
        case 'shirt':
            if (stock.shirt[size] < 1){
                res.send({
                    status: 'error',
                    error: '450'
                });
            }
            break;
        case 'undefined':
            res.send({
                status: 'error',
                error: '000'
            });
            break;
    
        default:
            
            break;
    };

    updateData();

    res.send({
        status: 'success'
    });
}

const handleConfirm = (req, res) => {
    res.render('pages/confirmation');
}

//todo list
let list = [];

const handleToDo = (req, res) => {
    res.render('pages/todo', {
        title: 'To Do List',
        list: list
    })
};

const handleAddItem = (req, res) => {
    let item = req.body.item;
    list.push(item);
    console.log(list);

    res.redirect('/todo');
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('tiny'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')

    // endpoints

    .post('/order', handleOrder)
    .get('/order-confirmed', handleConfirm)

    .get('/todo', handleToDo)
    .post('/data', handleAddItem)
    
    .get('/', (req, res) => res.send('Homepage?'))

    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
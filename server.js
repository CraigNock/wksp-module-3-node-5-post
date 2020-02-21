'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

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

    .post('/data', handleAddItem)

    .get('/todo', handleToDo)

    .get('/', (req, res) => res.send('Homepage?'))

    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
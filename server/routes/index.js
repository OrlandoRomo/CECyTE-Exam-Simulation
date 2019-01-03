const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//User and Manager routes
app.use(require('./user'));
app.use(require('./manager'));

//Category routes
app.use(require('./categories'));

//Questions routes
app.use(require('./questions'));
module.exports = app;
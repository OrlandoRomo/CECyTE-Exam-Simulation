const express = require('express');
const app = express();
//Enable CORS ExpressJS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE, OPTIONS")
    next();
});
//User and Manager routes
app.use(require('./manager'));
app.use(require('./user'));
//Login for User and Manager
app.use(require('./login'));
//Category routes
app.use(require('./categories'));
//Questions routes
app.use(require('./questions'));
//Test routes 
app.use(require('./test'));
module.exports = app;
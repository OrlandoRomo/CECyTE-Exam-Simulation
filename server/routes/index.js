const express = require('express');
const app = express();
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
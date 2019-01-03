const express = require('express');
const app = express();
const Category = require('../models/category');
let { isAuth } = require('../middlewares/auth');


//Questions POST Method
app.post('/category', isAuth, (req, res) => {
    let body = req.body;
    let category = new Category(body);
    category.save((err, newCategory) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        res.status(200).json({
            ok: true,
            category: newCategory
        });
    });
});
module.exports = app;
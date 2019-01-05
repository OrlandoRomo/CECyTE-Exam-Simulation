const express = require('express');
const app = express();
const Category = require('../models/category');
let { isAuth } = require('../middlewares/auth');

//Categories GET Method
app.get('/category', isAuth, (req, res) => {
    Category.find({}, (err, categoriesDB) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        return res.status(200).json({
            ok: true,
            categoriesDB
        });
    });
});

//Categories GET one category
app.get('/category/:id', isAuth, (req, res) => {
    let idCategory = req.params.id;
    Category.findById({ _id: idCategory }, (err, getCategory) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!getCategory) return res.status(500).json({
            ok: false,
            err: { message: 'La categoría no existe' }
        });
        return res.status(200).json({
            ok: true,
            getCategory
        });
    });
});

//Categories POST Method
app.post('/category', isAuth, (req, res) => {

    let body = req.body;
    let category = new Category(body);
    category.save((err, newCategory) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        return res.status(200).json({
            ok: true,
            newCategory
        })
    });
});

//Categories PUT Method
app.put('/category/:id', isAuth, (req, res) => {
    let body = req.body;
    let idCategory = req.params.id;
    Category.findByIdAndUpdate({ _id: idCategory }, body, { new: true, runValidators: true, context: 'query' }, (err, updateCategory) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!updateCategory) return res.status(200).json({
            ok: false,
            err: { message: 'La categoría no existe' }

        });
        return res.status(200).json({
            ok: true,
            updateCategory
        });
    });
});

//Categories DELETE Method
app.delete('/category/:id', isAuth, (req, res) => {
    let idCategory = req.params.id;
    Category.findByIdAndRemove({ _id: idCategory }, (err, deleteCategory) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!deleteCategory) return res.status(200).json({
            ok: false,
            err: { message: 'La categoría no existe' }

        });
        return res.status(200).json({
            ok: true,
            deleteCategory
        });
    });
});

//Category DELETE all
app.delete('/category', isAuth, (req, res) => {
    Category.deleteMany({}, (err, deleteCategories) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        return res.status(200).json({
            ok: true,
            deleteCategories
        });
    })
});


module.exports = app;
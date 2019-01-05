const express = require('express');
const app = express();
const { isAuth } = require('../middlewares/auth');
const Test = require('../models/test');

//Test GET Method
app.get('/test/:id', isAuth, (req, res) => {
    let idUser = req.params.id;
    Test.find({ user: idUser })
        .populate('user', 'name lastName')
        .exec((err, testsDB) => {
            if (err) return res.status(500).json({
                ok: false,
                err
            })
            return res.status(200).json({
                ok: true,
                testsDB
            });
        })
});

//Test POST Method
app.post('/test', isAuth, (req, res) => {
    let body = req.body
    let test = new Test(body);
    test.save((err, newTest) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        })
        return res.status(200).json({
            ok: true,
            newTest
        });
    });
});

//Test DELETE only one
app.delete('/test/:id', isAuth, (req, res) => {
    let idTest = req.params.id;
    Test.findByIdAndRemove(idTest, (err, deleteTest) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!deleteTest) return res.status(400).json({
            ok: false,
            err: { message: 'El test no existe' }
        })
        return res.status(200).json({
            ok: true,
            deleteTest
        });
    });
});

//Test DELETE all Tests
app.delete('/test', isAuth, (req, res) => {
    Test.deleteMany({}, (err, deleteTests) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        return res.status(200).json({
            ok: true,
            deleteTests
        });
    })
});

module.exports = app;
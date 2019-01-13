const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Manager = require('../models/manager');
const Test = require('../models/test');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { isAuth } = require('../middlewares/auth')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Manager GET Method
app.get('/manager/:id', isAuth, (req, res) => {
    let idManager = req.params.id;
    Manager.findById(idManager, (err, managerFound) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!managerFound) return res.status(400).json({
            ok: false,
            err: { message: 'el administrador no existe' }
        });
        return res.status(200).json({
            ok: true,
            user: managerFound
        });
    });
});

//Manager GET method for all users
app.get('/manager/users/:something', isAuth, (req, res) => {
    Test.find({})
        .populate('user', 'name lastName grade group')
        .exec((err, testsDB) => {
            if (err) return res.status(500).json({
                ok: false,
                err,
            });
            return res.status(200).json({
                ok: true,
                testsDB
            });
        })
});
//User POST method
app.post('/manager', (req, res) => {
    let body = req.body;
    let manager = new Manager({
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        //hashing password
        password: bcrypt.hashSync(body.password, 10),

    });
    manager.save((err, newManager) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        res.status(200).json({
            ok: true,
            user: newManager
        })
    });
});

//Manager PUT Method
app.put('/manager/:id', isAuth, (req, res) => {
    let idManager = req.params.id;
    let body = req.body;
    //Hashing the new password
    body.password = bcrypt.hashSync(body.password, 10);
    Manager.findByIdAndUpdate(idManager, body, { new: true, runValidators: true, context: 'query' }, (err, updateManager) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!updateManager) return res.status(400).json({
            ok: false,
            err: {
                message: 'El administrador no existe'
            }
        });
        return res.status(200).json({
            ok: true,
            updateManager
        });
    });
});



module.exports = app;
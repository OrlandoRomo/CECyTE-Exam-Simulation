const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Manager = require('../models/manager');
const bcrypt = require('bcryptjs');

//Manager GET Method
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
        res.json({
            ok: true,
            user: newManager
        })
    });
});

//Login Manager
app.post('/loginManager', (req, res) => {
    let body = req.body;
    Manager.findOne({ email: body.email }).exec((err, managerFound) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!managerFound) return res.status(400).json({
            ok: false,
            err: {
                message: 'Correo o contraseña incorrecta'
            }
        });
        if (!bcrypt.compareSync(body.password, managerFound.password)) return res.status(400).json({
            ok: false,
            err: {
                message: 'Correo o contraseña incorrecta'
            }
        });
        let token = jwt.sign({
            manager: managerFound
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
        res.status(200).json({
            ok: true,
            token
        });
    });
});

module.exports = app;
const User = require('../models/user');
const Manager = require('../models/manager');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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
            person: managerFound
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
        res.status(200).json({
            ok: true,
            person: managerFound,
            token
        });
    });
});

//Login User
app.post('/loginUser', (req, res) => {
    let body = req.body;
    console.log('\n', body);
    User.findOne({ email: body.email }).exec((err, userFound) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!userFound) return res.status(400).json({
            ok: false,
            err: {
                message: 'Correo o contraseña incorrecta'
            }
        });
        if (!bcrypt.compareSync(body.password, userFound.password)) return res.status(400).json({
            ok: false,
            err: {
                message: 'Correo o contraseña incorrecta'
            }
        });
        let token = jwt.sign({
            person: userFound
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
        res.json({
            ok: true,
            person: userFound,
            token
        });
    });
});

module.exports = app;
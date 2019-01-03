const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// User GET Method
app.get('/user/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, userFound) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!userFound) return res.status(400).json({
            ok: false,
            err: { message: 'el usuario no existe' }
        });
        return res.status(200).json({
            ok: true,
            user: userFound
        });
    });
});

//User POST method
app.post('/user', (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        //hashing password
        password: bcrypt.hashSync(body.password, 10),
        group: body.group,
        grade: body.grade
    });
    user.save((err, newUser) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        res.json({
            ok: true,
            user: newUser
        })
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
            user: userFound
        }, process.env.SEED_TOKEN, { expiresIn: process.env.EXPIRATION_TOKEN });
        res.status(200).json({
            ok: true,
            token
        });
    });
});

module.exports = app;
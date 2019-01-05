const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { isAuth } = require('../middlewares/auth');

// User GET Method
app.get('/user/:id', (req, res) => {
    let idUser = req.params.id;
    User.findById(idUser, (err, userFound) => {
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
        return res.json({
            ok: true,
            user: newUser
        })
    });
});

//User PUT method
app.put('/user/:id', isAuth, (req, res) => {
    let idUser = req.params.id;
    let body = req.body;
    //Hashing the new password
    body.password = bcrypt.hashSync(body.password, 10);
    User.findByIdAndUpdate(idUser, body, { new: true, runValidators: true, context: 'query' }, (err, updateUser) => {
        if (err) return res.status(500).json({
            ok: false,
            err
        });
        if (!updateUser) return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no existe'
            }
        });
        return res.status(200).json({
            ok: true,
            updateUser
        });
    });
});



module.exports = app;
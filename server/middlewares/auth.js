const jwt = require('jsonwebtoken');
let isAuth = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED_TOKEN, (err, info) => {
        if (err) return res.status(401).json({
            ok: false,
            err: {
                message: 'No se ha autenticado o no tiene permiso para entrar en esta página.'
            }
        });
        //Getting user/manager info
        req.person = info.person;
    });
    next();
};

module.exports = {
    isAuth
}
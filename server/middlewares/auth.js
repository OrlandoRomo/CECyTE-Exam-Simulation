const jwt = require('jsonwebtoken');
let isAuth = (req, res, next) => {
    let token = req.headers['token'];
    if (token !== undefined && token !== "") {
        jwt.verify(token, process.env.SEED_TOKEN, (err, info) => {
            if (err) return res.status(401).json({
                ok: false,
                err: {
                    message: 'No se ha autenticado o no tiene permiso para entrar en esta página.'
                }
            });
            else {
                //Getting user/manager info
                req.person = info.user;
                next();
            }
        });
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No se ha autenticado o no tiene permiso para entrar en esta página.'
            }
        });
    }
};

module.exports = {
    isAuth
}
const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    const errores = validationResult(req);

    //Valida contra los check que hay declarados en el route de usuarios
    if (!errores.isEmpty()) {
        return res.status(400).json({
            status: false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos
}
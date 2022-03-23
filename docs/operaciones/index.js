const { crearUsuarioPorApp, obtenerUsuariosPaginados } = require('./crear-usuario-app');

module.exports = {
    paths: {
        '/api/usuarios': {
            ...obtenerUsuariosPaginados
        },
        '/api/usuarios/crearUsuarioPorApp': {
            ...crearUsuarioPorApp,
        }
    }
}
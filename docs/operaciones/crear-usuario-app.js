const crearUsuarioPorApp = {
    post: {
        tags: ['Crear usuario por app'],
        description: "Crear usuario por app",
        operationId: "crearUsuarioPorApp",
        parameters: [],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/CreateUserByApp'
                    }
                }
            }
        },
        responses: {
            '200': {
                description: "Creado satisfactoriamente"
            },
            '500': {
                description: 'Server error'
            }
        }
    }
}

const obtenerUsuariosPaginados = {
    get: {
        tags: ['Obtener usuarios con paginación'],
        description: "Obtener usuarios con paginacion",
        operationId: "obtenerUsuariosPaginacion",
        parameters: [{
            name: "desde",
            in: "path",
            schema: {
                $ref: "#/components/schemas/desde"
            },
            required: true,
            description: "Numero maximo de records"
        }],
        responses: {
            '404': {
                description: "Todo is not found",
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/Error',
                            example: {
                                message: "We can't find the todo",
                                internal_code: "Invalid id"
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    crearUsuarioPorApp,
    obtenerUsuariosPaginados
}
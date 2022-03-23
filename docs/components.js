module.exports = {
    components: {
        schemas: {
            desde: {
                type: 'string',
                description: "max filter to show records",
                example: "8"
            },
            CreateUserByApp: {
                type: 'object',
                properties: {
                    nombre: { type: 'string', description: 'Nombre de usuario', example: 'test user app' },
                    email: { type: "string", description: 'Email de usuario', example: 'testuserapp@test.com' },
                    role: { type: "string", description: 'Rol de usuario', example: 'USER_ROLE' },
                    password: { type: "string", description: 'Password de usuario en texto claro', example: 'test123' },
                }
            },
            Error: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    },
                    internal_code: {
                        type: 'string'
                    }
                }
            }
        }
    }
}
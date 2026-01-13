import swaggerJSDoc from 'swagger-jsdoc';
const options = {
    definition: {
        openapi: '3.0.0', // Versi OpenAPI standar
        info: {
            title: 'Expense Tracker API',
            version: '1.0.0',
            description: 'Dokumentasi API untuk aplikasi Smart Expense Tracker',
            contact: {
                name: 'Backend Developer',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000/api', // Sesuaikan dengan prefix route kamu
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [], // Ini biar gemboknya muncul (Testing pakai Token)
            },
        ],
    },
    // PENTING: Ini menunjuk ke file mana saja yang ada komentar @swagger nya
    apis: ['./src/routes/*.ts', './src/schemas/*.ts'],
};
export const swaggerSpec = swaggerJSDoc(options);
//# sourceMappingURL=swagger.config.js.map
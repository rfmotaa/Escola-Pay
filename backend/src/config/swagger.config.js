import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da QuickQueue',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de gerenciamento de cantinas escolares (Quick Queue).',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api/v1`,
        description: 'Servidor de Desenvolvimento',
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
        bearerAuth: [],
      },
    ],
  },
  apis: [path.resolve('./src/routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Product Catalog API',
    version: '1.0.0',
    description: 'API documentation for the Product Catalog project',
  },
  servers: [
    {
      url: 'http://localhost:3000',
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
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/docs/authDocs.ts',
    './src/docs/productDocs.ts',
    './src/models/*.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

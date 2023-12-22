// swagger.js

const swaggerJSDoc = require('swagger-jsdoc');


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Documentation',
            version: '1.0.0',
            description: 'API documentation for your project',
        },
    },
    apis: ['./db.js'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);
  
//console.log(swaggerSpec);

module.exports = swaggerSpec;

const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'My API',
    description: 'Users API',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};
const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);
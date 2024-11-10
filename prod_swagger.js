const swaggerAutogen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'My API',
    description: 'Users API',
  },
  host: 'nimbus.bradyhodge.dev',
  schemes: ['https'],
};
const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);
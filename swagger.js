const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Guide Booking API',
    description: 'API สำหรับระบบจองไกด์ท่องเที่ยว'
  },
  host: 'localhost:4000',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js'];

swaggerAutogen(outputFile, routes, doc);
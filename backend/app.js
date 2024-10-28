var express = require('express');
var app = express();
const cors = require('cors');
app.use(express.json());

const { connectDB } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
const userRoutes  = require('./routes/user');

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    swaggerUi.setup(swaggerDocument)(req, res, next);
});
app.use('/user', userRoutes);


connectDB(() => {
    app.listen(8080, function() {
        console.log('Server is running on port 8080');
    });
});
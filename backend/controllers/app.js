var express = require('express');
var app = express();
const bodyParser = require('body-parser');
const { connectDB } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const cors = require('cors');
const path = require('path');

const userRoutes  = require('./routes/user');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
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
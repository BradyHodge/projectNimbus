const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const { connectDB } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const path = require('path');
const userRoutes = require('./routes/user');
const uiRoutes = require('./routes/ui');

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    swaggerUi.setup(swaggerDocument)(req, res, next);
});

app.use('/user', userRoutes);
app.use('/', uiRoutes);

connectDB(() => {
    app.listen(8080, function() {
        console.log('Server is running on port 8080');
    });
});

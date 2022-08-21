const express = require('express')

// Controllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Routers
const { usersRouter } = require('./routes/user.routes');
const { characterRouter } = require('./routes/character.routes');
const { movieOrSerieRouter } = require('./routes/movieOrSerie.routes');

// Init express app
const app = express();

// Enable incoming JSON data
app.use(express.json());

// Endpoints
app.use('/users', usersRouter);
app.use('/character', characterRouter);
app.use('/movies', movieOrSerieRouter);

// Global error handler
app.use(globalErrorHandler);

module.exports = { app };
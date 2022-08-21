const express = require('express');

// Controllers
const {
    getAllMoviesOrseries,
    getMoviesOrSerieById,
    createMovieOrSerie,
    updateMovieOrSerie,
    deleteMovieOrSerie
} = require('../controllers/movieOrSerie.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');

const {
    createMovieorSerieValidations,
    checkValidations,
} = require('../middlewares/validations.middleware');

const {
    movieOrSerieExists
} = require('../middlewares/movieOrSerie.middelware');

const { upload } = require('../utils/upload.util')

const router = express.Router();

router.use(protectSession);

router.get('/', getAllMoviesOrseries);

router.get('/:id', movieOrSerieExists, getMoviesOrSerieById);

router.post('/', upload.array('productImg', 5), createMovieorSerieValidations, checkValidations, createMovieOrSerie)

router
    .route('/:id')
    .patch(movieOrSerieExists, updateMovieOrSerie)
    .delete(movieOrSerieExists, deleteMovieOrSerie);

module.exports = { movieOrSerieRouter: router };
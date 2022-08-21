const { MoviesOrSeries } = require('../models/movieOrSerie.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const movieOrSerieExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const movieOrSerie = await MoviesOrSeries.findOne({
        where: { id, status: 'active' },
    });

    if (!movieOrSerie) {
        return next(new AppError('movie or serie does not exist with given Id', 404));
    }

    // Add user data to the req object
    req.movieOrSerie = movieOrSerie;
    next();
    });

module.exports = {
    movieOrSerieExists
};
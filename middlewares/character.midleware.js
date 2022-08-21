const { Characters } = require('../models/character.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const characterExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const character = await Characters.findOne({
        where: { id, status: 'active' },
    });

    if (!character) {
        return next(new AppError('Character does not exist with given Id', 404));
    }

    // Add user data to the req object
    req.character = character;
    next();
    });

module.exports = {
    characterExists
};
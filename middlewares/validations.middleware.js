const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

const createUserValidations = [
    body('username').notEmpty().withMessage('Username cannot be empty'),
    body('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('Must be a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
];

const createCharacterValidations = [
    body('name').notEmpty().withMessage('Name cannot be empty'),
    body('age').isFloat({ min: 0 }).withMessage('age must be greater than 0'),
    body('weigth').isFloat({ min: 0 }).withMessage('weigth must be greater than 0'),
    body('history').notEmpty().withMessage('History cannot be empty'),
];

const createMovieorSerieValidations = [
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('year').isFloat({ min: 0 }).withMessage('Year must be greater than 0'),
    body('puntuation').isFloat({ min: 0 }).withMessage('Punctuation must be greater than 0')
];

const checkValidations = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messages = errors.array().map(({ msg }) => msg);

        // [msg, msg, msg] -> 'msg. msg. msg'
        const errorMsg = messages.join('. ');

        return next(new AppError(errorMsg, 400));
    }

    next();
};

module.exports = {
    createUserValidations,
    createCharacterValidations,
    createMovieorSerieValidations,
    checkValidations
};
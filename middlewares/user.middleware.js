const { Users } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const userExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const user = await Users.findOne({
        where: { id, status: 'active' },
        attributes: { exclude: ['password'] },
    });

    if (!user) {
        return next(new AppError('User does not exist with given Id', 404));
    }

    // Add user data to the req object
    req.user = user;
    next();
    });

module.exports = {
    userExists
};
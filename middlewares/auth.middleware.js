const jwt = require('jsonwebtoken');

// Models
const { Users } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const protectSession = catchAsync(async (req, res, next) => {
    let token;

    // Extract token from headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // ['Bearer', 'token']
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Session invalid', 403));
    }

    // Validate token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // decoded returns -> { id: 1, iat: 1651713776, exp: 1651717376 }
    const user = await Users.findOne({
        where: { id: decoded.id, status: 'active' },
    });

    if (!user) {
        return next(
        new AppError('The owner of this token is no longer available', 403)
        );
    }

    req.sessionUser = user;
    next();
});

module.exports = {
    protectSession
};
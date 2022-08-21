const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { Users } = require("../models/user.model");

const { catchAsync } = require("../utils/catchAsync.util")
const { Email } = require("../utils/email.util")

const { AppError } = require("../utils/appError.util");

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await Users.findAll({
        attributes: { exclude: ['password'] },
    })

    res.status(200).json({
        users,
    })
})

const createNewUser = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);
    
    const newUser = await Users.create({
        username,
        email,
        password: hashPassword
    });
    
    newUser.password = undefined;

    await new Email(email).sendWelcome(username);

    res.status(200).json({
        status: "succes",
        newUser
    });
});

const loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await Users.findOne({
        where: { email, status: "active" },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError(400, "credentials are invalid"));
    }

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
        status: "succes",
        token
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    const { username, email } = req.body

    await user.update({ username, email });

    res.status(200).json({
        status: "succes",
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: "delete" });

    res.status(200).json({
        status: "succes",
    });
});

const checkToken = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;

	res.status(200).json({
		status: 'success',
		user: sessionUser,
	});
}); 

module.exports = {
    createNewUser,
    loginUser,
    updateUser,
    deleteUser,
    checkToken,
    getAllUsers
}
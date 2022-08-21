const express = require('express');

// Middlewares
const {
    userExists
} = require('../middlewares/user.middleware');
const { protectSession } = require('../middlewares/auth.middleware');
const {
    createUserValidations,
    checkValidations,
} = require('../middlewares/validations.middleware');

// Controller
const {
    createNewUser,
    loginUser,
    updateUser,
    deleteUser,
    checkToken,
    getAllUsers
} = require('../controllers/users.controllers');

const router = express.Router();

router.post('/auth/register', createUserValidations, checkValidations, createNewUser);

router.post('/auth/login', loginUser);

router.use(protectSession);

router.get('/', getAllUsers);

router.get('/check-token', checkToken);

router
    .route('/:id')
    .patch(userExists, updateUser)
    .delete(userExists, deleteUser);

module.exports = { usersRouter: router };

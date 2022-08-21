const express = require('express');

// Controllers
const {
    getAllCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    assignCharactersInMoviesOrSeries
} = require('../controllers/characters.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');
const { characterExists } = require('../middlewares/character.midleware')
const { createCharacterValidations, checkValidations } = require('../middlewares/validations.middleware')

const { upload } = require('../utils/upload.util')

const router = express.Router();

router.use(protectSession);

router.get('/', getAllCharacters);

router.post('/create-character', upload.array('characterImg', 5), createCharacterValidations, checkValidations, createCharacter);

router.post('/', assignCharactersInMoviesOrSeries);

router
    .route('/:id')
    .get(characterExists, getCharacterById)
    .patch(characterExists, updateCharacter)
    .delete(characterExists, deleteCharacter);

module.exports = { characterRouter: router };

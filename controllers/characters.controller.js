const dotenv = require('dotenv');

// Models
const { Characters } = require('../models/character.model');
const { MoviesOrSeries } = require('../models/movieOrSerie.model');
const { CharactersInMoviesOrSeries } = require('../models/characterInMovieOrSerie.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

// Gen secrets for JWT, require('crypto').randomBytes(64).toString('hex')

dotenv.config({ path: './config.env' });

const getAllCharacters = catchAsync(async (req, res, next) => {
	const characters = await Characters.findAll({ 
        include: [ { model: MoviesOrSeries } ]
    });

	res.status(200).json({
		status: 'success',
		characters
	});
});

const getCharacterById = catchAsync(async (req, res, next) => {
    const { character } = req;

    const characterImgsPromises = character.ImgUrl.map(async characterImg => {
		const imgRef = ref(storage, characterImg);

		const imgFullPath = await getDownloadURL(imgRef);

		characterImg = imgFullPath;
	});

	await Promise.all(characterImgsPromises);

    res.status(200).json({
        status: "success",
        character,
    });
});

const createCharacter = catchAsync(async (req, res, next) => {
    const { name, age, weigth, history } = req.body

    const newCharacter = await Characters.create({
        name,
        age,
        weigth,
        history
    });

    if (req.files.length > 0) {
		const filesPromises = req.files.map(async file => {
			const imgRef = ref(storage, `character/${Date.now()}_${file.originalname}`);
			const imgRes = await uploadBytes(imgRef, file.buffer);

			return await newCharacter.update({
				imgUrl: imgRes.metadata.fullPath
			});
		});

		await Promise.all(filesPromises);
	}

    

    res.status(200).json({
        status: "success",
        newCharacter
    });
});

const updateCharacter = catchAsync(async (req, res, next) => {
	const { character } = req;
	const { name, age, weigth, history } = req.body;

	await character.update({ name, age, weigth, history });

	res.status(204).json({ status: 'success' });
});

const deleteCharacter = catchAsync(async (req, res, next) => {
	const { character } = req;

	// await user.destroy();
	await character.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

const assignCharactersInMoviesOrSeries = catchAsync(async (req, res, next) => {
	const { characterId, movieOrSerieId } = req.body;

	const CharacterInMovieOrSerie = await CharactersInMoviesOrSeries.create({ characterId, movieOrSerieId });

	res.status(201).json({
		status: 'success',
		CharacterInMovieOrSerie
	});
});

module.exports = {
    getAllCharacters,
	getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    assignCharactersInMoviesOrSeries
};
const dotenv = require('dotenv');

// Models
const { Characters } = require('../models/character.model');
const { MoviesOrSeries } = require('../models/movieOrSerie.model');
const { CharactersInMoviesOrSeries } = require('../models/characterInMovieOrSerie.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

// Gen secrets for JWT, require('crypto').randomBytes(64).toString('hex')

dotenv.config({ path: './config.env' });

const getAllMoviesOrseries = catchAsync(async (req, res, next) => {
	const moviesOrSeries = await MoviesOrSeries.findAll({ 
        include: [ { model: Characters } ]
    });

	res.status(200).json({
		status: 'success',
		moviesOrSeries
	});
});

const getMoviesOrSerieById = catchAsync(async (req, res, next) => {
    const { movieOrSerie } = req;

    const movieOrSerieImgsPromises = movieOrSerie.ImgUrl.map(async movieOrSerieImg => {
		const imgRef = ref(storage, movieOrSerieImg);

		const imgFullPath = await getDownloadURL(imgRef);

		movieOrSerieImg = imgFullPath;
	});

	await Promise.all(movieOrSerieImgsPromises);

    res.status(200).json({
        status: "success",
        movieOrSerie,
    });
});

const createMovieOrSerie = catchAsync(async (req, res, next) => {
    const { title, year, punctuation } = req.body

    const newMovieOrSerie = await MoviesOrSeries.create({
        title,
        year,
        punctuation
    });

    if (req.files.length > 0) {
		const filesPromises = req.files.map(async file => {
			const imgRef = ref(storage, `movieOrSerie/${Date.now()}_${file.originalname}`);
			const imgRes = await uploadBytes(imgRef, file.buffer);

			return await newMovieOrSerie.update({
				imgUrl: imgRes.metadata.fullPath
			});
		});

		await Promise.all(filesPromises);
	}

    

    res.status(200).json({
        status: "success",
        newMovieOrSerie
    });
});

const updateMovieOrSerie = catchAsync(async (req, res, next) => {
	const { movieOrSerie } = req;
	const { title, year, punctuation } = req.body;

	await movieOrSerie.update({ title, year, punctuation });

	res.status(204).json({ status: 'success' });
});

const deleteMovieOrSerie = catchAsync(async (req, res, next) => {
	const { movieOrSerie } = req;

	// await user.destroy();
	await movieOrSerie.update({ status: 'deleted' });

	res.status(204).json({ status: 'success' });
});

module.exports = {
    getAllMoviesOrseries,
    getMoviesOrSerieById,
    createMovieOrSerie,
    updateMovieOrSerie,
    deleteMovieOrSerie
};
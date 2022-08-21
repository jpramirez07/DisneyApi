const { Characters } = require("../models/character.model");
const { MoviesOrSeries } = require("../models/movieOrSerie.model");
const { Genres } = require("../models/genre.model")

const initModels = () => {

    // M genre <--> M moviesOrSeries
    Genres.belongsToMany(MoviesOrSeries, { foreignKey: 'genreId', through: 'genreInMovieOrSerie' });
    MoviesOrSeries.belongsToMany(Genres, { foreignKey: 'movieOrSerieId', through: 'genreInMovieOrSerie' });

    // M characters <--> M moviesOrSeries
    Characters.belongsToMany(MoviesOrSeries, { foreignKey: 'characterId', through: 'characterInMovieOrSerie' });
    MoviesOrSeries.belongsToMany(Characters, { foreignKey: 'movieOrSerieId', through: 'characterInMovieOrSerie' });
    
};

module.exports = { initModels };
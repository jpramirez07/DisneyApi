const { db, DataTypes } = require('../utils/database.util')

// Create our first model(table)
const GenresInMoviesOrSeries = db.define('genreInMovieOrSerie', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    genreId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    movieOrSerieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
})

module.exports = { GenresInMoviesOrSeries }
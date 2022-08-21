const { db, DataTypes } = require('../utils/database.util')

// Create our first model(table)
const CharactersInMoviesOrSeries = db.define('characterInMovieOrSerie', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    characterId: {
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

module.exports = { CharactersInMoviesOrSeries }
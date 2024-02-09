const express = require('express');
const movieController = require('../controllers/moviesController')
const moviesRouter = express.Router();

moviesRouter.route("/highest-rated").get(movieController.getHighestRated,movieController.getAllMovies)
moviesRouter.route("/movie-stats").get(movieController.getMovieStats)
moviesRouter.route("/movie-by-genre/:genre").get(movieController.getMovieByGenre)

moviesRouter.route("/")
    .get(movieController.getAllMovies)
    .post(movieController.postMovie)

moviesRouter.route("/:id")
    .get(movieController.getMovie)
    .patch(movieController.patchMovie)
    .delete(movieController.deleteMovie)

module.exports = moviesRouter

const express = require('express')
let app = express()
const morgan = require('morgan')
const moviesRouter = require('./routes/moviesRoutes')

const logger = function (req, res, next) {
    next()
}

app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('./public'))
app.use(logger)
app.use("/api/v1/movies", moviesRouter)

app.all('*', (req,res,next) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server!`)
    err.status = 'fail'
    err.statusCode = 404
    next(err)
})

app.use((error,req,res,next) => {
    error.statusCode = error.statusCode || 500,
    error.status = error.status || 'error',
    res.status(error.statusCode).json({
        status : error.statusCode,
        message : error.message
    })
})

module.exports = app


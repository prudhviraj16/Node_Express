const Apifeatures = require('../utils/ApiFeatures')
const movieSchema = require('./../model/movieModel')


exports.getHighestRated = (req,res,next) => {
    req.query.limit= '5'
    req.query.sort= '-ratings'
    next()
}

exports.getAllMovies = async(req,res) => {
        try {
            const features = new Apifeatures(movieSchema.find(), req.query).filter().sort().limitFields().paginate()
            let movies = await features.query
            res.status(200).json({
                message : "Success",
                data : movies
            })
        }catch(err){
            console.log(err);
        }
}


exports.getMovie = async(req,res) => {
    try {
        const movie = await movieSchema.findById(req.params.id)
        res.status(200).json({  
            message : "success",
            data : movie
        })
    } catch(err) {
        res.status(404).json(err.message)
    }
 }

 exports.postMovie = async(req,res) => {
    try{
        const movie = await movieSchema.create(req.body)
        res.status(200).json({
            message : "success",
            data : movie
        })
    }catch(err){
        res.status(404).json(err)
    }
}

exports.patchMovie = async(req,res) => {
    try{
        const movie = await movieSchema.findByIdAndUpdate(req.params.id,req.body, {new : true})
        res.status(200).json({
            message : "success",
            data : movie
        })
    }catch(err){
        res.status(404).json(err)
    }
}

exports.deleteMovie = async(req,res) => {
    try{
        await movieSchema.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message : "successfully deleted",
        })
    }catch(err){
        res.status(404).json(err)
    }
}

exports.getMovieStats = async(req,res) => {
    try{
        const stats = await movieSchema.aggregate([
            {$match : {releaseDate : {$lte : new Date()}}},
            {$match : {ratings : {$gte : 4.5}}},
            {$group : {
                _id : '$releaseYear',
                avgRating : {$avg : 'ratings'},
                avgprice : {$avg : '$price'},
                minPrice : {$min : '$price'},
                maxPrice : {$max : '$price'},
                priceTotal : {$sum : '$price'},
                movieCount : {$sum : 1}
            }},
            {$sort : {minPrice : 1}}
        ])

        res.status(200).json(stats)
    }catch(err){
        res.status(400).json(err.message)
    }
}

exports.getMovieByGenre = async(req,res) => {
    try{
        const genre = req.params.genre
        const movies = await movieSchema.aggregate([
            {$unwind : '$genres'},
            {$group : {
                _id : '$genres',
                movieCount : {$sum : 1},
                movies : {$push : '$name'}
            }},
            {$addFields : {genre : '$_id'}},
            {$project : {_id : 0}},
            {$sort : {minPrice : -1}},
            {$limit : 6}
        ])

        res.status(200).json(movies)
    }catch(err){
        console.log(err);
    }
}
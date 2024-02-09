const mongoose = require('mongoose')
const fs= require('fs')
const movieSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, 'Name is required field'],
      maxlength : [100, "Movie name must not be greater than 100 characters"],
      minlength : [4,"Movie name must have atleast 4 characters"],
      unique : true,
      trim : true
    },
    description : {
      type : String,
      required : [true, 'Description is required field'],
      trim : true
    },
    duration : {
      type :Number,
      required : [true, 'Duration is required field']
    },
    ratings : {
      type : Number,
      min : [1, "Rating must be above 1"],
      max : [10, " Rating must be less than 10"]
    },
    totalRating : {
      type : Number
    },
    releaseYear : {
      type : Number,
      required : [true, 'Release year is required field']
    },
    releaseDate : {
      type : Date
    },
    createdAt : {
      type : Date,
      default : Date.now()
    },
    genres : {
      type : [String],
      required : [true, 'Genres id required field']
    },
    directors : {
      type : [String],
      required : [true , 'Directors is required field']
    },
    coverImage : {
      type :String,
      required : [true, 'Cover image is a required field']
    },
    actors : {
      type : [String],
      required : [true, 'actors is a required field']
    },
    price : {
      type : Number,
      required : [true, 'Price is required field']
    },
    createdBy : {
      type : String,
    }

  }, 
  {toJSON : {virtuals : true}},
  {toObjects : {virtuals : true}}
  )

  movieSchema.pre('save', function(next){
    this.createdBy = 'Prudhvi Raju';
    next()
  })

  movieSchema.post('save', function(doc,next){
    const content = `A new movie with name ${doc.name} is createdBy ${doc.createdBy}`
    fs.writeFileSync('./Log/log.txt',content,(err)=>{
      console.log(err);
    })
    next()
  })

  movieSchema.pre(/^find/, function(next){
    this.startDate = Date.now()
    next()
  })

  movieSchema.post(/^find/, function(docs,next){
    this.endDate = Date.now()
    console.log(this.endDate-this.startDate);
    next()
  })

  movieSchema.pre('aggregate',function(next){
    // console.log(this.pipeline().unshift({$match : {releaseDate : {$lte : new Date()}}}));
    next()
  })

  movieSchema.virtual('durationInHours').get(function(){
    return this.duration / 60
  })
  
  module.exports = mongoose.model('movies', movieSchema)

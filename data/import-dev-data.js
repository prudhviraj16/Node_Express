const mongoose = require('mongoose');
const fs = require('fs')
const dotenv = require('dotenv')
const Movie = require('./../model/movieModel.js')
dotenv.config({path : './config.env'})

mongoose
  .connect(process.env.CONN_STR)
  .then((res) => {
    console.log("Connected to db successfully");
  })
  .catch((err) => {
    console.log("Failed to connect DB");
  });

const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'))

const deleteMovies = async () => {
    try{
        await Movie.deleteMany()
    }catch(err) {
        console.log(err.message);
    }
}


const importMovies = async() => {
    try{
        await Movie.create(movies)
    }catch(err){
        console.log(err.message);
    }

    process.exit()
}


if(process.argv[2] === '--import'){
    importMovies()
}

if(process.argv[2] === '--delete'){
    deleteMovies()
}
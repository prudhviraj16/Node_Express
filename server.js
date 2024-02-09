const mongoose = require('mongoose')
const dotenv = require('dotenv')
const mongoURI = `mongodb+srv://Prudhvi876:Prudhvi876@cluster0.66ack1u.mongodb.net/`;
dotenv.config({path : './config.env'})

mongoose
  .connect(process.env.CONN_STR)
  .then((res) => {
    console.log("Connected to db successfully");
  })
  .catch((err) => {
    console.log("Failed to connect DB");
  });

const app = require('./index')

app.listen(3000, ()=> {
    console.log("Listening on port 3000");
})
// Call in installed dependencies
import express from 'express'
// import dependencies
import bodyParser from "body-parser";
import mongoose from "mongoose";
import logger from "morgan";

import mainRoutes from "../routes/main.js"

// set up dependencies
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

// set up mongoose
const uri = 'mongodb+srv://admin:admin@cluster0.bb2dwct.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });

// set up port number
const port = 5035;

// set up route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Project with Nodejs Express and MongoDB"
  });
});

app.use('/api', mainRoutes)
app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
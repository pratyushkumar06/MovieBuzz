const express = require('express');
const PORTNO = 4000;
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const passport = require('passport');
const url = config.mongoUrl; //Setting up the db URL
const userRouter = require('./routes/userRouter');
const movieRouter = require('./routes/movieRouter');

mongoose.set('useFindAndModify', false); //For deprecated warnings
mongoose.set('useCreateIndex', true);

const connect =mongoose.connect(url,{ useUnifiedTopology: true,useNewUrlParser: true });

connect.then((db)=>{
  console.log('Connected to Server!');

},(err)=>{console.log(err);});

app.use(express.json());
app.use(passport.initialize());  //Initializing Passport 
app.use('/user',userRouter);
app.use('/movie',movieRouter);


app.get('/',(req,res) =>{
    res.status(200).send('Welcome to Movie Buzz');
});



app.listen(PORTNO,ERROR =>{
    console.log(ERROR || `Listening on Port: ${PORTNO}`);
});


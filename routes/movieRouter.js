const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authenticate = require('../utils/authenticate');
const Movie = require('../models/movie');
const perPage = 10;  //10 Results Returned per Page with Page no starting from 0
router.use(bodyParser.json());

router.route('/')
.get(async (req,res) =>{
    let pageNo = req.query.pageNo;
    try{
        const movie = await Movie.find().limit(perPage).skip(perPage*pageNo).sort({name:'asc'}).populate('userId');
        console.log(movie)
        res.status(200).send(movie);
       } catch(err){
           res.status(404).send(err);
       }
})
.post(authenticate.verifyUser, async (req,res) =>{
    try{
        const movie = await Movie.create(req.body);
        res.status(200).send(movie);
    } catch(err){
        res.status(404).send(err);
    }
});

router.route('/:movieId')
.put(authenticate.verifyUser, async (req,res) =>{
    try{ 
        const findMovie = await Movie.findById(req.params.movieId);
        if(findMovie != null){
            let id =  findMovie.user._id;
            if(req.user._id.equals(id)){  //The Users Id is stored in the req object by Passport
                const movie = await Movie.findByIdAndUpdate(req.params.movieId,{
                    $set : req.body
                },{new : true});
                res.status(200).send(movie);
            }
            else{
                res.status(401).send('You cannot perform this Operation');
            }
        }
    } catch(err){
        res.status(404).send(err);
    }
})
.delete(authenticate.verifyUser, async (req,res) =>{
    try{
        const findMovie = await Movie.findById(req.params.movieId);
        if(findMovie != null){
            let id =  findMovie.user._id;
            if(req.user._id.equals(id)){ 
                const movie = await Movie.findByIdAndDelete(req.params.movieId);
                res.status(200).send(movie);
            }
            else{
                res.status(401).send('You cannot perform this Operation');
            }
        }
    } catch(err){
        res.status(404).send(err);
    }
});

module.exports = router;
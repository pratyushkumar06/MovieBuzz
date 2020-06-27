const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../utils/authenticate');
const perPage = 10;  //10 Results Returned per Page with Page no starting from 0

router.use(bodyParser.json());

router.get('/',async (req,res) =>{
    let pageNo = req.query.pageNo;
    try{
        let user = await User.find({}).limit(perPage).skip(perPage*pageNo).sort({firstname:'asc'}).populate('favorites.movieId');
        res.status(200).send(user);
    }
    catch(err){
        res.status(404).send(err);
    }
});

router.post('/signup',async (req,res) =>{
    try{

        let user = await User.register(new User({username: req.body.username}),req.body.password);
        user.firstname = req.body.firstname;   //Setting the firstname and lastname
        user.lastname = req.body.lastname;

        await user.save();
        passport.authenticate('local')(req,res,() => {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json({success:true, status: 'Registration Successful'});
      });
    }
    catch(err){
        res.status(404).send(err);
    }
});

router.post('/login',passport.authenticate('local'), async (req,res) =>{
    try{
        var token = await authenticate.getToken({_id: req.user._id});
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success:true, token: token, status: 'You are Successfully Logged In'});
    }
    catch(err){
        res.status(404).send(err);
    }
});

router.route('/:userId/favorites')
.get( async(req,res) =>{
    let pageNo = req.query.pageNo;
    try{
        let user = await User.findById(req.params.userId).limit(perPage).skip(perPage*pageNo).sort({firstname:'asc'}).populate('favorites.movieId');
        res.status(200).send(user);
    }
    catch(err){
        res.status(404).send(err);
    }
})
.post(authenticate.verifyUser, async (req,res) =>{
    try{
        let user = await User.findById(req.params.userId);
        let id = user._id;
        if( id.equals(req.user._id)){
            user.favorites.push(req.body);
            await user.save();
            res.status(200).send(user);
        }
        else{
            res.status(401).send('You cannot perform this Operation');
        }
        
    }
    catch(err){
        res.status(404).send(err);
    }
})
.delete(authenticate.verifyUser, async (req,res) =>{ //Delete All Favorites
    try{
        let user = await User.findById(req.params.userId);
        let id = user._id;
        if( id.equals(req.user._id)){
            for (var i= (user.favorites.length -1 ); i>=0 ; i--){  
                user.favorites.id(user.favorites[i]._id).remove();
            }
            await user.save();
            res.status(200).send('Deleted Favorites');
        }
        else{
            res.status(401).send('You cannot perform this Operation');
        }
    } catch(err){
        res.status(404).send(err);
    }
});

router.route('/:userId/favorites/:favId')
.delete(authenticate.verifyUser, async (req,res) =>{ //Delete One Particular Favorite
    try{
        let user = await User.findById(req.params.userId);
        let id = user._id;
        if( id.equals(req.user._id)){
            user.favorites.id(req.params.favId).remove();
            await user.save();
            res.status(200).send('Deleted Favorite');
        }
        else{
            res.status(401).send('You cannot perform this Operation');
        }
    } catch(err){
        res.status(404).send(err);
    }
});

module.exports = router;

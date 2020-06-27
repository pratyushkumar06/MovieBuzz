const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-float').loadType(mongoose);
const Float = mongoose.Types.Float;

const movieSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    genre:{
        type: Array,      //Action, Romance, Sci-fi, Thriller, Horror, Drama, Comedy Coming From FrontEnd
        required: true    
    },
    director:{
        type: String,
        required: true
    },
    duration:{     //In Minutes
        type: Number,
        required: true
    },
    imdbRating:{
        type: Float,
        min: 1,
        max: 10,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
});

module.exports = mongoose.model('Movie',movieSchema);
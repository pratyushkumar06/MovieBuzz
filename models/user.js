const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
const favSchema = new Schema({
    movieId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required:true,
        sparse:true
    }
})
const userSchema = new Schema({
    firstname:{
        type: String,
        default:'user'
    },
    lastname:{
        type: String,
        default:''
    },
    favorites:[favSchema]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);

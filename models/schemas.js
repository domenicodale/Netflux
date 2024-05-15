var mongoose = require('mongoose');
var schema = mongoose.Schema;

// movies
let moviesSchema = new schema({
    imagePath:{type:String, required: true},
    title:{type:String, required: true},
    description:{type:String, required: true},
    rating:{type:Number , required:true},
    votes:{type:Number , required:true},
    genre: {type:schema.Types.ObjectId, ref:'genre'}
  });

// genre
let genreSchema = new schema({
    name: {type:String, required:true}
});

// signup
let signupSchema = new schema({
    email: {type:String, required:true},
    entryDate: {type:Date, default:Date.now}
});

//review
let reviewSchema = new schema({
    id:{type:String, required: true},
    imagePath:{type:String, required: true},
    title:{type:String, required: true},
    txtrev:{type:String, required: true},
    name:{type:String, required: true},
    vote:{type:Number , required:true}
})

let movies = mongoose.model('movies', moviesSchema, 'movies');
let genre = mongoose.model('genre', genreSchema, 'genre');
let signup = mongoose.model('signup', signupSchema, 'signup');
let review = mongoose.model('review', reviewSchema, 'review');
let mySchemas = {'movies':movies, 'genre':genre, 'signup':signup, 'review':review};

module.exports = mySchemas;
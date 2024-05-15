var express = require('express');
var router = express.Router();
var schemas = require('../models/schemas.js');
const axios = require('axios');

/* GET home page. */
router.get('/', async(req, res, next) => {
  let movies = schemas.movies;

  let moviesResult = await movies.find({}).exec((err, moviesData) => {
    if (moviesData) {
      res.render('index', {title:'CineFlix', data:moviesData, email:''});
    }
  });
});

router.post('/signup', async(req, res) => {
  var em = req.body.emailInput;

  let signup = schemas.signup;
  let signupExist = await signup.findOne({email:em}).exec( async(err, result) => {
    if (!result) {
        let newEmail = new schemas.signup({email:em});
        let saveEmail = await newEmail.save( (err, emailResult) => {});
    }
  });

  let movies = schemas.movies;
  let moviesResult = await movies.find({}).exec((err, moviesData) => {
    if (moviesData) {
      res.render('index', {title:'Cineflix', data:moviesData, email:em});
    }
  });
});

router.post('/recensione', async(req, res) => {
  var score = req.body.rating;
  var nome = req.body.name;
  var film = req.body.filmid;
  var img = req.body.filmimg;
  var ttl = req.body.filmtl;
  var txt = req.body.review;
 
  let review = schemas.review;
  let movies = schemas.movies;
  
   let newReview = new schemas.review({id:film, imagePath:img, title:ttl, txtrev:txt, name:nome, vote:score});
   let saveReview = await newReview.save( (err, reviewResult) => {});



let recensioniArray = [];



review.find({ id: film },'vote', (err, recensioni) => {
    if (err) {
        console.error('Si è verificato un errore durante la ricerca delle recensioni:', err);
    } else {
        if (recensioni.length > 0) {
            
            recensioni.forEach(recensione => {
                recensioniArray.push(recensione.vote);
            });

             const mediaRecensioniNum = recensioniArray.reduce((acc, val) => acc + val, 0) / recensioniArray.length;
             const mediaRecensioni = parseFloat(mediaRecensioniNum);
             const votiagg = recensioniArray.length;
             movies.findByIdAndUpdate(film, { rating: mediaRecensioni, votes: votiagg }, { new: true }, (err, filmAggiornato) => {
              if (err) {
                  console.error('Si è verificato un errore durante l\'aggiornamento del film:', err);
              } else {
                  console.log('Film aggiornato con successo:', filmAggiornato);
                  
              }
          });
            console.log('Media delle recensioni:', mediaRecensioni);
            console.log('Recensioni per il film con ID', film, ':', recensioniArray);
            
        } else {
            console.log('Nessuna recensione trovata per il film con ID', film);
        }
    }
});


  
  let moviesResult = await movies.find({}).exec((err, moviesData) => {
    if (moviesData) {
      res.render('index', {title:'Cineflix', data:moviesData});
    }
  });
  
});





router.get('/classifica', async (req, res, next) => {
  let movies = schemas.movies;

  try {
    
    let moviesData = await movies.find({}).exec();


    // Ordina i dati in base al rating
    moviesData.sort((a, b) => b.rating - a.rating); // Ordine decrescente per rating

    // Passa i dati ordinati 
    res.render('classifica', { title: 'Cineflix', data: moviesData });
  } catch (err) {
    console.error(err);
   
    next(err);
  }
});

router.get('/reviews', async (req, res, next) => {
  let review = schemas.review;
  let movies = schemas.movies;

  try {
    
    let reviewData = await review.find({}).exec();

    let moviesData = await movies.find({}).exec();

   
    

    
    res.render('reviews', { title: 'Cineflix', data: reviewData, film: moviesData });
  } catch (err) {
    console.error(err);
   
    next(err);
  }
});






module.exports = router;

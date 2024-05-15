var createError = require('http-errors');
var express = require('express');
var hbs = require('hbs');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helpers = require('./components/hbsHelpers');
var mongoose = require('mongoose');
require('dotenv/config');


mongoose.set('strictQuery', false);
var indexRouter = require('./routes/index');
var moviesRouter = require('./routes/movies');

var app = express();

hbs.registerPartials(path.join(__dirname, 'views/partials'), (err) => {});
for (let helper in helpers) {
  hbs.registerHelper(helper, helpers[helper]);
}


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/movies', moviesRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});


mongoose.connect(process.env.DB_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then( ()=> {
  console.log('DB Connected!');
})
.catch( (err) => {
  console.log(err);
});






module.exports = app;

'use strict';


// TEMP: Simple In-Memory Database

const { PORT } = require('./config');

console.log('Hello World');
const express = require('express');
const morgan = require('morgan');
const notesRouter = require('./routers/notes.router');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use('/v1', notesRouter);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if(require.main === module){
  app.listen(PORT, function(){
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}

module.exports = app;

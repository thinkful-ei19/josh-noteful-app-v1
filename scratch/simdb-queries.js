'use strict';

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET Notes with search
/*app.get('/api/notes', (req, res, next)=> {
    const { searchTerm } = req.query;
notes.filter(searchTerm, (err, list) => {
  if (err) {
    return next(err);
  }
  res.json(list);
});*/

// GET Notes by ID
/*app.get('/api/notes/:id', (req, res, next) => {
    const { id } = req.params;
notes.find(id, (err, item) => {
  if (err) {
    return next(err);
  }
  if (item) {
    res.json(item);
  } else {
    console.log('not found');
  }
});*/

// PUT (Update) Notes by ID
/*const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});*/

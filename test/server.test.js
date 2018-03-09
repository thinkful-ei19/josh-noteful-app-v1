'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHTTP = require('chai-http');

const expect = chai.expect;

chai.use(chaiHTTP);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/bad/path')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /v1/notes', function () {

  it('should return default of 10 notes', function () {
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });
  });

  it('should return a list of correct fields', function () {
    return chai.request(app)
      .get('/v1/notes')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function (item){
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });

  it('should return correct search results for a valid query', function(){
    return chai.request(app)
      .get('/v1/notes?searchTerm=about%20cats')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(4);
        expect(res.body[0]).to.be.an('object');
      });
  });

  it('should return an empty array for incorrect query', function() {
    return chai.request(app)
      .get('/v1/notes?searchTerm=not%20a%20valid%20search')
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });
});

describe('GET /v1/notes/:id', function(){
  it('should return correct note', function(){
    return chai.request(app)
      .get('/v1/notes/1000')
      .then(res=> {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1000);
        expect(res.body.title).to.equal('5 life lessons learned from cats');
      });
  });

  it('should respond with a 404 error for invalid id', function(){
    return chai.request(app)
      .get('/v1/notes/3000')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('POST /v1/notes', function(){
  it('should create and return a new note with valid data',function(){
    const newNote = {
      title: 'Some article about cats',
      content: 'BlahdeBlahdeBlahdeBlah'
    };
    return chai.request(app)
      .post('/v1/notes')
      .send(newNote)
      .then(res =>{
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.include.keys('id', 'title', 'content');
        expect(res.body.id).to.be.equal(1010);
        expect(res.body.title).to.equal(newNote.title);
        expect(res.body.content).to.equal(newNote.content);
        expect(res).to.have.header('location');
      });
  });

  it('should return an error when missing title field', function(){
    const newNote = {
      foo: 'bar'
    };
    return chai.request(app)
      .post('/v1/notes')
      .send(newNote)
      .catch(err=> err.response)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.be.equal('Missing `title` in request body');
      });
  });

});

describe('PUT /v1/notes', function(){
  it('should update a note', function(){
    const updatedNote = {
      'title': 'Dogs are better',
      'content': 'Its just a fact'
    };
    return chai.request(app)
      .put('/v1/notes/1002')
      .send(updatedNote)
      .then(res=>{
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1002);
        expect(res.body.title).to.equal(updatedNote.title);
        expect(res.body.content).to.equal(updatedNote.content);
      });
  });  

  it('should respond with a 404 error if invalid id ', function(){
    const updatedNote = {
      'title': 'Dogs are better',
      'content': 'Its just a fact'
    };
    return chai.request(app)
      .put('/v1/notes/3000')
      .send(updatedNote)
      .catch(err=> err.response)
      .then(res =>{
        expect(res).to.have.status(404);
      });
  });
}); 

describe('DELETE /v1/notes/:id', function(){
  it('should delete an item by id', function(){
    return chai.request(app)
      .delete('/v1/notes/1005')
      .then(res=>{
        expect(res).to.have.status(204);
      });
  });

  it('should respond with a 404 for invalid id', function(){
    return chai.request(app)
      .delete('/v1/notes/3000')
      .catch(err => err.response)
      .then(res =>{
        expect(res).to.have.status(404);
      });
  });
});

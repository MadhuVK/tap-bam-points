var assert = require('chai').expect 
var expect = require('chai').assert

var supertest = require('supertest')
var app = require('../bin/www')
var api = supertest('http://localhost:' + app.config.port); 

console.log(app.port)

process.env.NODE_ENV = 'test';

/* Root level hooks */ 
before(function() {
});

after(function() {
});

beforeEach(function() {
});

afterEach(function() {
});

describe("REST API", function() {

  describe("api/users", function() {

    describe("GET /users", function() {

      it('should return a 200 response with no data present', function(done) {
        api.get('/api/users').set('Accept', 'application/json')
        .expect(200, done); 
      });

      it('should return json with no data present', function(done) {
        api.get('/api/users').set('Accept', 'application/json')
        .expect('Content-Type', /json/, done); 
      });

      it('should return a 200 response with data present', function(done) {
        api.get('/api/users').set('Accept', 'application/json')
        .expect(200, done); 
      });

      it('should return json with data present', function(done) {
        api.get('/api/users').set('Accept', 'application/json')
        .expect('Content-Type', /json/, done); 
      });


      it('should have expected body', function(done) {
        var expectedBody = [
      {"id": 1,"valid": 1,"lastName": "Ngonye","firstName": "Antonio","barcodeHash": "123","parentId": 1,"house": "red","memberStatus": "initiate"},
        {"id": 2,"valid": 1,"lastName": "D","firstName": "Mel", "barcodeHash": "456","parentId": 2,"house": "blue","memberStatus": "active"},
      ]; 
        api.get('/api/users').set('Accept', 'application/json')
        .expect(expectedBody, done); 
      }); 

    }); 

    describe("POST /users", function() {

      it('returns a 200 response on valid post', function() {
        assert(false); 
      }); 

      it('successfully modifies database', function() {
        assert(false); 
      }); 

      it('return a 500 response on duplicate post', function() {
        assert(false); 
      }); 

      it('return a 500 response on post with missing fields', function() {
        assert(false); 
      }); 


    }); 

    describe("GET /users/{id}); ", function(done) {
      var valid_user = 1
      var deleted_user = 2
      var invalid_user = 3

      it('should return 200 for a valid user', function(done) {
        api.get('/api/users/' + valid_user).set('Accept', 'application/json')
        .expect(200, done); 
      }); 

      it('should return json for a valid user', function(done) {
        api.get('/api/users/' + valid_user).set('Accept', 'application/json')
        .expect('Content-Type', /json/, done); 
      }); 

      it('should have valid fields in json', function(done) {
        var expectedResult = {"id": valid_user, "lastName": "Ngonye", "firstName": "Antonio", "barcodeHash": "123", "house": "red", "memberStatus": "initiate" }; 
        api.get('/api/users/' + valid_user).set('Accept', 'application/json')
        .expect(expectedResult, done); 
      }); 

      it('should return 404 for a deleted user', function(done) {
        api.get('/api/users/' + deleted_user).set('Accept', 'application/json')
        .expect(404, done); 
      }); 

      it('should return 404 for an invalid user', function(done) {
        api.get('/api/users/' + invalid_user).set('Accept', 'application/json')
        .expect(404, done); 
      }); 

    }); 

    describe("PATCH /users/{id}); ", function() {
    }); 

    describe("DELETE /users/{id}); ", function() {
    }); 

  }); 


});

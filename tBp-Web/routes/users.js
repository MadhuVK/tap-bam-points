var express = require('express');
var router = express.Router();
var userData = require('../src/userData.js');
var userEventData = require('../src/userEventData.js');

var jwt = require('jsonwebtoken'); 
var config = require('../bin/config')[process.env.NODE_ENV]

router.use(function(req, res, next) {
  var token = req.body["access_token"] || req.query["access_token"] || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.jwt_secret, function(err, decoded) {      
      if (err) {
        res.status(403).json({ 
            success: false, 
            message: 'Failed to authenticate token.' 
          });    
      } else {
        next();
      }
    });

  } else {
    res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

router.route('/')
  .get(function (req, res) {
    userData.getAll()
    .then(users => res.status(200).json(users));
  })

  .post(function (req, res) {
    userData.add(req.body)
    .then(userId => res.status(201).json({'id': userId}));
  });

router.route('/:user_id')
  .get(function (req, res) {
    userData.getById(req.params.user_id)
    .then(user => res.status(200).json(user))
    .catch(() => res.sendStatus(404));
  })

  .patch(function (req, res) {
    var patch = req.body;
    userData.patch(req.params.user_id, patch)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404));
  })

  .delete(function (req, res) {
    userData.deleteById(req.params.user_id)
    .then(() => res.sendStatus(200));
  });

router.route('/:user_id/events')
  .get(function (req, res) {
    userEventData.getUserAttendances(req.params.user_id)
    .then(history => res.json(history));
  });

router.route('/:user_id/events/:event_id')
  .get(function (req, res) {
    userEventData.getAttendance(req.params.user_id, req.params.event_id)
    .then(attendance => res.json(attendance));
  })

  .put(function (req, res) {
    userEventData.addUserToEvent(req.params.user_id, req.body)
    .then(() => res.sendStatus(201));
  })

  .patch(function (req, res) {
    var eventPatch = req.body;
    userEventData.patchAttendance(req.params.user_id, req.params.event_id, eventPatch)
    .then(() => res.sendStatus(200));
  })

  .delete(function (req, res) {
    userEventData.deleteAttendance(req.params.user_id, req.params.event_id)
    .then(() => res.sendStatus(200));
  });

module.exports = router;

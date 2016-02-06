var express = require('express');
var router = express.Router();
var eventData = require('../src/eventData.js');
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
    res.status(403).json({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
});

router.route('/')
  .get(function (req, res) {
    eventData.getAll().then(events => res.json(events));
  })

  .post(function (req, res) {
    eventData.add(req.body).then(id => res.status(201).json(id));
  });

router.route('/:event_id')
  .get(function (req, res) {
    eventData.getById(req.params.event_id)
    .then(id => res.status(200).json(event))
    .catch(() => res.sendStatus(404));
  })

  .patch(function (req, res) {
    var patch = req.body;
    eventData.patch(req.params.event_id, patch)
    .then(() => res.sendStatus(200));
  })

  .delete(function (req, res) {
    eventData.deleteById(req.params.event_id)
    .then(() => res.sendStatus(200));
  });

router.route('/:event_id/users')
  .get(function (req, res) {
    userEventData.getEventAttendees(req.params.event_id)
    .then(attendees => res.json(attendees));
  });

router.route('/:event_id/users/:user_id')
  .get(function (req, res) {
    res.redirect("/api/users/" + req.params.user_id + "/events/" + req.params.event_id);
  })

  .put(function (req, res) {
    res.redirect("/api/users/" + req.params.user_id + "/events/" + req.params.event_id);
  })

  .patch(function (req, res) {
    res.redirect("/api/users/" + req.params.user_id + "/events/" + req.params.event_id);
  })

  .delete(function (req, res) {
    res.redirect("/api/users/" + req.params.user_id + "/events/" + req.params.event_id);
  });

module.exports = router;

var express = require('express');
var router = express.Router();
var data = require('../src/userData.js');

router.route('/')
  .get(function (req, res) {
    data.getUsers("tbp")
    .then(users => res.status(200).json(users));
  })

  .post(function (req, res) {
    data.addUser(req.body)
    .then(userId => res.status(201).json({'id': userId}));
  });

router.route('/:user_id')
  .get(function (req, res) {
    data.getUserById(req.params.user_id, function (user) {
      res.status(200).json(user);
    });
  })

  .patch(function (req, res) {
    var patch = req.body;
    data.updateUserByPatch(req.params.user_id, patch, function() {
      res.sendStatus(200);
    });
  })

  .delete(function (req, res) {
    data.deleteUserById(req.params.user_id, function() {
      res.sendStatus(200);
    });
  });

router.route('/:user_id/events')
  .get(function (req, res) {
    data.getUserAttendanceHistory(req.params.user_id, function(history) {
      res.json(history);
    });
  });

router.route('/:user_id/events/:event_id')
  .get(function (req, res) {
    data.getUserEventAttendance(req.params.user_id, req.params.event_id, function(attendance) {
      res.json(attendance);
    });
  })

  .put(function (req, res) {
    data.addUserToEvent(req.params.user_id, req.body, function() {
      res.sendStatus(201);
    });
  })

  .patch(function (req, res) {
    var eventPatch = req.body;
    data.updateUserEventAttendanceByPatch(req.params.user_id, req.params.event_id, eventPatch, function(eventPatch) {
      res.sendStatus(200);
    });
  })

  .delete(function (req, res) {
    data.deleteUserEventAttendance(req.params.user_id, req.params.event_id, function() {
      res.sendStatus(200);
    });
  });

module.exports = router;
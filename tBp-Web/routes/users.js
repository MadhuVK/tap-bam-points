var express = require('express');
var router = express.Router();
var data = require('../src/data.js');

router.route('/')
  .all(function (req, res) {
    // for future things
  })

  .get(function (req, res) {
    data.getUsers("tbp", function(users) {
      res.status(200).json(users);
    });
  })

  .post(function (req, res) {
    data.addUser(req.body, function (user_id) {
      res.status(201).json(req.body);
    });
  });

router.route('/:user_id')
  .get(function (req, res) {
    data.getUserById(req.params.user_id, function (user) {
      res.status(200).json(user);
    });
  })

  .patch(function (req, res) {
    res.body += " PATCH REQUEST";
    res.send(res.body);
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
    res.body += " PATCH REQUEST";
    res.send(res.body);
  })

  .delete(function (req, res) {
    data.deleteUserEventAttendance(req.params.user_id, req.params.event_id, function() {
      res.sendStatus(200);
    });
  });

module.exports = router;
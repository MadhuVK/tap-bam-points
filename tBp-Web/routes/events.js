var express = require('express');
var router = express.Router();
var data = require('../src/data.js');

router.route('/')
  .get(function (req, res) {
    data.getEvents('tbp', function(events) {
      res.json(events);
    });
  })

  .post(function (req, res) {
    data.addEvent(req.body, function(event_id) {
      res.status(201).json(req.body);
    });
  });

router.route('/:event_id')
  .get(function (req, res) {
    data.getEventById(req.params.event_id, function(event) {
      res.status(200).json(event);
    });
  })

  .patch(function (req, res) {
    res.body += " PATCH REQUEST";
    res.send(res.body);

  })

  .delete(function (req, res) {
    data.deleteEventById(req.params.event_id, function() {
      res.sendStatus(200);
    });
  });

router.route('/:event_id/users')
  .get(function (req, res) {
    data.getEventAttendees(req.params.event_id, function(attendees) {
      res.json(attendees);
    });
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
var express = require('express');
var router = express.Router();
var data = require('../src/data.js');

router.route('/')
  .all(function(req, res, next) {
    // future things
    next();
  })

  .get(function (req, res) {
    data.getEvents('tbp', function(events) {
      res.json(events);
    });
  })

  .post(function (req, res) {
    data.addEvent(req.body, function(event_id) {
      res.status(200).json(req.body);
    });
  }
);

router.route('/:event_id')
  .all(function(req, res, next) {
    res.body = "Method call to route /events/" + req.params.event_id;

    next();
  })

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
  }
);

router.route('/:event_id/users')
  .all(function(req, res, next) {
    res.body = "Method call to route /events/" +
      req.params.event_id + "/users";

    next();

  })
  .get(function (req, res) {
    res.body += " GET REQUEST";
    res.send(res.body);

  })
  .post(function (req, res) {
    res.body += " POST REQUEST";
    res.send(res.body);

  });

router.route('/:event_id/users/:user_id')
  .all(function(req, res, next) {
    res.body = "Method call to route /events/" +
      req.params.event_id + "/users/" + req.params.user_id;

    next();
  })
  .patch(function (req, res) {
    res.body += " PATCH REQUEST";
    res.send(res.body);

  })
  .delete(function (req, res) {
    res.body += " DELETE REQUEST";
    res.send(res.body);

  });

module.exports = router;

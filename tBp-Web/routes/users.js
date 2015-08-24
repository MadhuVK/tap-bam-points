var express = require('express');
var router = express.Router();
var data = require('../src/data.js');

router.route('/')
  .all(function (req, res, next) {
    // for future things
    next();
  })
  .get(function (req, res, next) {
    data.getUsers("tbp", function(rows) {
      res.status(200).json(rows);
      next();
    });
  })
  .post(function (req, res, next) {
    data.addUser(req.body, function (user_id) {
      res.status(201).json(req.body);
      next();
    });
  });

router.route('/:user_id')
  .all(function (req, res, next) {
    // for future things
    next();
  })
  .get(function (req, res, next) {
    data.getUserById(req.params.user_id, function (user) {
      res.status(200).json(user);
      next();
    });
  })
  .patch(function (req, res, next) {
    res.body += " PATCH REQUEST";
    res.send(res.body);

    next();
  })
  .delete(function (req, res, next) {
    data.deleteUserById(req.params.user_id, function() {
      res.sendStatus(200);
      next();
    });
  });

router.route('/:user_id/events')
  .all(function (req, res, next) {
    res.body = "Method call to route /users/" /
      + req.params.user_id + "/events";

    next();
  })
  .get(function (req, res, next) {
    res.body += " GET REQUEST";
    res.send(res.body);

    next();
  })
  .post(function (req, res) {
    res.body += " POST REQUEST";
    res.send(res.body);

    next();
  });

router.route('/:user_id/events/:event_id')
  .all(function(req, res, next) {
    res.body = "Method call to route /users/" +
      req.params.user_id + "/events/" + req.params.event_id;

    next();
  })
  .patch(function (req, res, next) {
    res.body += " PATCH REQUEST";
    res.send(res.body);

    next();
  })
  .delete(function (req, res) {
    res.body += " DELETE REQUEST";
    res.send(res.body);

    next();
  });

module.exports = router;
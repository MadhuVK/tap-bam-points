var express = require('express');
var router = express.Router();

/* GET users listing. */

// ROUTE /users
router.route('/')
    .all(function(req, res, next) {
        res.body = "Method call to route /users";

        next();
    })
    .get(function(req, res, next) {
        res.body += " GET REQUEST";
        res.send(res.body);

        next();
    })
    .post(function(req, res, next) {
        res.body += " POST REQUEST";
        res.send(res.body);

        next();

    });

// Route /users/{id}
router.route('/:uid(\\d+)')
    .all(function(req, res, next) {
        res.body = 'Method call to route /users/' + req.params.uid;

        next();
    })
    .get(function(req, res, next) {
        res.body += " GET REQUEST";
        res.send(res.body);

        next();
    })
    .patch(function(req, res, next) {
        res.body += " PATCH REQUEST";
        res.send(res.body);

        next();
    })
    .delete(function(req, res, next) {
        res.body += " DELETE REQUEST";
        res.send(res.body);

        next();
    });

// Route /users/{id}/events/
router.route('/:uid(\\d+)/events')
    .all(function(req, res, next) {
        res.body = 'Method call to route /users/' + req.params.uid + '/events';

        next();
    })
    .get(function(req, res, next) {
        res.body += " GET REQUEST";
        res.send(res.body);

        next();

    })
    .post(function(req, res, next) {
        res.body += " POST REQUEST";
        res.send(res.body);

        next();
    });

// Route /users/{id}events/{event_id}
router.route('/:uid(\\d+)/events/:eid(\\d+)')
    .all(function(req, res, next) {
        res.body = 'Method call to route /users/' + req.params.uid + '/events/' + req.params.eid;

        next();

    })
    .patch(function(req, res, next) {
        res.body += " PATCH REQUEST";
        res.send(res.body);

        next();

    })
    .delete(function(req, res, next) {
        res.body += " DELETE REQUEST";
        res.send(res.body);

        next();

    });

module.exports = router;

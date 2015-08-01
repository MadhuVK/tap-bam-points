var express = require('express');
var router = express.Router();

// ROUTE /events
router.route('/')
    .all(function(req, res, next) {
        res.body = "Method call to route /events";

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

// Route /events/{id}
router.route('/:eid(\\d+)')
    .all(function(req, res, next) {
        res.body = 'Method call to route /events/' + req.params.eid;

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

// Route /events/{id}/users/
router.route('/:eid(\\d+)/users')
    .all(function(req, res, next) {
        res.body = 'Method call to route /events/' + req.params.eid + '/users';

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

// Route /events/{id}/users/{user_id}
router.route('/:eid(\\d+)/useres/:uid(\\d+)')
    .all(function(req, res, next) {
        res.body = 'Method call to route /events/' + req.params.eid + '/users/' + req.params.uid;

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

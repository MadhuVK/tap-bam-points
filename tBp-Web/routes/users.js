var express = require('express');
var router = express.Router();

router.route('/')
    .all(function(req, res, next) {
        res.body = "Method call to route /users";

        next();
    })
	.get(function (req, res) {
        res.body += " GET REQUEST";
		res.send(res.body);

        next();

	})
	.post(function (req, res) {
        res.body += " POST REQUEST";
        res.send(res.body);

        next();
    });

router.route('/:user_id')
    .all(function(req, res, next) {
        res.body = "Method call to route /users/" + req.params.user_id;

        next();
    })
	.get(function (req, res) {
        res.body += " GET REQUEST";
        res.send(res.body);

        next();
    })
	.patch(function (req, res) {
        res.body += " PATCH REQUEST";
        res.send(res.body);

        next();
    })
	.delete(function (req, res) {
        res.body = " DELETE REQUEST";
        res.send(res.body);

        next();
    });

router.route('/:user_id/events')
    .all(function(req, res, next) {
        res.body = "Method call to route /users/"
            + req.params.user_id + "/events";

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

router.route('/:user_id/events/:event_id')
    .all(function(req, res, next) {
        res.body = "Method call to route /users/"
            + req.params.user_id + "/events/" + req.params.event_id;

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

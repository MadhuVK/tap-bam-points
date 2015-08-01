var express = require('express');
var router = express.Router();

router.route('/')
    .all(function(req, res, next) {
        res.body = "Method call to route /events";

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

router.route('/:event_id')
	.all(function(req, res, next) {
		res.body = "Method call to route /events/" + req.params.event_id;

		next();
	})
	.get(function (req, res) {
		res.body += " GET REQUEST";
		res.send(res.body);

	})
	.patch(function (req, res) {
		res.body += " PATCH REQUEST";
		res.send(res.body);

	})
	.delete(function (req, res) {
		res.body += " DELETE REQUEST";
		res.send(res.body);

	});

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

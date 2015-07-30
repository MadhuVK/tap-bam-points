var express = require('express');
var router = express.Router();

router.route('/')
	.get(function (req, res) {
		res.send('get all users');
	})
	.post(function (req, res) {});

router.route('/:user_id')
	.get(function (req, res) {})
	.patch(function (req, res) {})
	.delete(function (req, res) {});

router.route('/:user_id/events')
	.get(function (req, res) {})
	.post(function (req, res) {});

router.route('/:user_id/events/:event_id')
	.patch(function (req, res) {})
	.delete(function (req, res) {});

module.exports = router;

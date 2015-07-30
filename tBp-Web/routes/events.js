var express = require('express');
var router = express.Router();

router.route('/')
	.get(function (req, res) {
		res.send('getting all events');
	})
	.post(function (req, res) {});

router.route('/:event_id')
	.get(function (req, res) {})
	.patch(function (req, res) {})
	.delete(function (req, res) {});

router.route('/:event_id/users')
	.get(function (req, res) {})
	.post(function (req, res) {});

router.route('/:event_id/users/user_id')
	.patch(function (req, res) {})
	.delete(function (req, res) {});

module.exports = router;

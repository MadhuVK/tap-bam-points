var express = require('express');
var router = express.Router();
var data = require('../src/data.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/me', function(req, res) {
  const USER = 1;
  data.getUserById(USER, function(user) {
    data.getUserAttendanceHistory(USER, function(history) {
      user.history = history;
      res.render('user', { title: 'Your TBP profile', user: user });
    });
  });
});

module.exports = router;

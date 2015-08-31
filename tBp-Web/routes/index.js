const express = require('express');
const router = express.Router();
const data = require('../src/data.js');
const historyAnalyze = require('../src/historyAnalyze.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/me', function(req, res) {
  const USER = 1;
  data.getUserById(USER, function(user) {
    data.getUserAttendanceHistory(USER, function(history) {
      user.history = history;
      pointStats = historyAnalyze(history, user.memberStatus);
      res.render('user', { title: 'Your TBP profile', user: user, pointStats: pointStats});
    });
  });
});

module.exports = router;

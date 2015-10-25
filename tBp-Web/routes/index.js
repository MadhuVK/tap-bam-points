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

router.get('/admin', adminLogin); // Generic catch all that will be used by most people
router.get('/admin_console', adminConsole);

router.get('/admin_login', adminLogin);
router.post('/admin', validateLogin);

function adminConsole(req, res) {
  // TODO: Check auth token before loading
  data.getUsers('tbp', function(retreivedUsers) {
    data.getEvents('tbp', function(retrievedEvents) {
      res.render('admin_console.html', { title: 'Admin Console', users: retreivedUsers, events: retrievedEvents});
    });
  });
}

function adminLogin(req, res) {
  // TODO: Need to do Cookie Session Access thingies to check if logged in.
  var loggedIn = false;
  if (loggedIn) {
    res.redirect("/admin_console")
  } else {
    var captchaSite = "6LfuTg4TAAAAABkpca63EfsbuSIZk7egO8EYRIOG";
    res.render('admin_login.html', {sitekey: captchaSite});
  }
}

function validateLogin(req, res) {
  var captchaSecret = "6LfuTg4TAAAAAIKMgPpnkYEM6zcLhEbTB0oIqOnv";
  res.redirect("/admin_console");
}


module.exports = router;

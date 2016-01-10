const express = require('express');
const router = express.Router();
const data = require('../src/data.js');
const historyAnalyze = require('../src/historyAnalyze.js');
const session_login = require("../src/session_login.js");

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
router.post('/admin', validateAdminLogin);

// TODO: Need to do Cookie Session Access thingies to check if logged in.
router.get('/admin_login', adminLogin);
router.get('/admin_console', adminConsole);

router.get('/login', userLogin);
router.post('/login', validateUserLogin);


function adminLogin(req, res) {
  var loggedIn = false; // TODO
  if (loggedIn) {
    res.redirect("/admin_console");
  } else {
    res.render('admin_login.html', {sitekey: session_login.captchaSite});
  }
}

function userLogin(req, res) {
  var loggedIn = false;
  if (loggedIn) {
    res.redirect("/me");
  } else {
    res.render("user_login.html", {});
  }
}

function validateAdminLogin(req, res) {
  session_login.validate_captcha(req, session_login.captchaSecret, function onValidate(valid_captcha) {
    if (valid_captcha) {
      if (session_login.login_admin(req.body["user"], req.body["password"])) {
        res.redirect("/admin_console");
      } else {
        res.redirect("/admin_login");
      }
    } else {
      res.redirect("/admin_login");
    }
  });
}

function validateUserLogin(req, res) {
  session_login.login_user(req.body["password"], function onLogin(userId) {

    console.log(userId)

    if (userId['id'] == -1) {
      res.redirect("/login");
    } else {
      console.log(userId)
      res.redirect("/me"); //TODO: Use userId to store session
    }
  });
}

function adminConsole(req, res) {
  data.getUsers('tbp', function(retreivedUsers) {
    data.getEvents('tbp', function(retrievedEvents) {
      res.render('admin_console.html',
          { title: 'Admin Console',
            users: retreivedUsers,
            events: retrievedEvents});
    });
  });
}

module.exports = router;

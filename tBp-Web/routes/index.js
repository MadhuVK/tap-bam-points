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
      res.render('user.html', { title: 'Your TBP profile', user: user, pointStats: pointStats});
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

router.get('/event_create', eventForm);
router.post('/event_create', createEvent);

function eventForm(req, res) {
  res.render('event_create.html', {errCode:"false"});
}

function createEvent(req, res) {
  console.log(req.body);
  var body = req.body;
  var dateExp = /^(20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/;
  var date = body["eventDate"];
  var dateTime = body["eventDate"] + " " + body["eventTime"];

  if (dateExp.test(date)) {
    data.addEvent({name:body["eventName"], datetime:dateTime, points:body["eventPoints"], officer:body["eventOfficer"], type:body["eventCategory"]},
        function(id) {
          res.redirect("/admin_console")
        });

  }
  else {
    res.render('event_create.html', {errCode:"true"});
  }


  //res.redirect('/admin_console');
}

router.post('/event_delete', eventDelete);

function eventDelete(req, res) {
  var body = req.body;
  var e_id = body["id"];
  console.log(e_id);
  data.getEventAttendees(e_id, function(retrievedUsers) {
    if (retrievedUsers.length == 0) {
      data.deleteEventById(e_id,
          function() {
            res.redirect("/admin_console");
          });
    }
    else {
      console.log("Event not empty")
      res.redirect("/admin_console");
    }

  });


}


module.exports = router;

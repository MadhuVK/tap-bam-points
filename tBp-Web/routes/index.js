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
  const USER = 2;
  data.getUserById(USER, function(user) {
    data.getUserAttendanceHistory(USER, function(history) {
      data.getEventsNotAttendedByUserID(user.id, function(events) {
        console.log(events);
        user.history = history;
        console.log(user);
        console.log(user.memberStatus);
        pointStats = historyAnalyze(history, user.memberStatus);
        res.render('user.html', {title: 'Your TBP profile', user: user, pointStats: pointStats, eventsAdd:events});
      });
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

    console.log(userId);

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
  var id = body["d_id"];
  console.log(id);
  data.getEventAttendees(id, function(retrievedUsers) {
    if (retrievedUsers.length == 0) {
      data.deleteEventById(id,
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

router.post('/event_view', eventView);

function eventView(req, res) {
  var body = req.body;
  var id = body["v_id"];
  data.getEventById(id, function(retrievedEvent) {
    data.getEventAttendees(id, function(retrievedUsers) {
      res.render('event_view.html', {event: retrievedEvent, users: retrievedUsers, errCode :false});
    });
  });
}

router.post('/add_event_user', addUsertoEvent);

function addUsertoEvent(req, res) {
  var body = req.body;
  var e_id = body["e_id"];
  var b_code = body["b_code"];
  var e_code = true;
  console.log(body);

  data.getUserByBarcode(b_code, function(rUser) {
    console.log(rUser);
    data.getEventById(e_id, function(retrievedEvent) {
      if(rUser.length !=0) {
        e_code = false;
        data.addUserToEvent(rUser.id, retrievedEvent, function(){
        });
      }
      res.redirect('/event_view', {v_id:e_id});
    });
  });
}

function addEventToUser(req, res) {
  var body = req.body;
}

module.exports = router;

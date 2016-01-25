const express = require('express');
const router = express.Router();
const userData = require('../src/userData.js');
const eventData = require('../src/eventData.js');
const userEventData = require('../src/userEventData.js');
const historyAnalyze = require('../src/historyAnalyze.js');
const session_login = require("../src/session_login.js");
const points = require('../src/points.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/me', function(req, res) {
  const USER = 2;
  var personalInfo = userData.getById(USER);
  var history = userEventData.getUserAttendances(USER);
  var notAttended = userEventData.getEventsNotAttendedByUserId(USER);
  Promise.all([personalInfo, history, notAttended])
  .then(results => {
    var user = results[0];
    var history = results[1];
    var notAttended = results[2];

    user.history = history;
    var pointStats = historyAnalyze(user.history, user.memberStatus);
    res.render('user.html',
      { title: 'Your TBP profile',
        user: user,
        pointStats: pointStats,
        unattendedEvents: notAttended }
    );
  });
});

router.get('/leaderboard', function(req, res) {
  userData.getAll()
  .then(users => points.addDataToUsers(users))
  .then(users => res.render('leaderboard.html', { title: 'Leaderboard', users: users }));
});

router.get('/admin', adminLogin); // Generic catch all that will be used by most people
router.post('/admin', validateAdminLogin);

router.post("/mobile_login", validateMobileLogin);

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

function validateMobileLogin(req, res) {
  var valid = session_login.login_admin("tbp@ucsd.edu", req.body["pass_hash"]);

  res.status(200).json(valid);
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
      if (session_login.login_admin(req.body["user"], session_login.hash(req.body["password"]))) {
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
  session_login.login_user(session_login.hash(req.body["password"]), function onLogin(userId) {

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
  var users = userData.getAll().then(points.addDataToUsers);
  var events = eventData.getAll();
  Promise.all([users, events])
  .then(results => {
    res.render('admin_console.html',
      { title: 'Admin Console',
        users:  results[0],
        events: results[1] }
    );
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

router.post('/add_user_event', addEventToUser);
function addEventToUser(req, res) {
  var body = req.body;
  var e_id = body["addEventId"];
  var u_id = body["u_id"];
  var points = body["points"];

  eventData.getById(e_id)
  .then(e => {
    var attendance = {
      "id": e.id,
      "name": e.name,
      "pointsEarned": points,
      "type": e.type
    };

    return userEventData.addUserToEvent(u_id, attendance);
  })
  .then(() => res.redirect('/me'));
}

module.exports = router;

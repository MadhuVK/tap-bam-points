const express = require('express');
const router = express.Router();
const userData = require('../src/userData.js');
const eventData = require('../src/eventData.js');
const userEventData = require('../src/userEventData.js');
const historyAnalyze = require('../src/historyAnalyze.js');
const auth_helper = require("../src/auth_helper");
const points = require('../src/points.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.logged_in) {
    res.redirect('/me'); 
  } else {
    res.redirect('/leaderboard'); 
  }
});

router.get('/me', function(req, res) {
  if (!req.session.logged_in) {
    res.redirect('/leaderboard'); 
  }

  var id = req.session.logged_in; 

  var personalInfo = userData.getById(id);
  var history = userEventData.getUserAttendances(id);
  var notAttended = userEventData.getEventsNotAttendedByUserId(id);

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
  .then(users => {
    res.render('leaderboard.html',
	  { title: 'Leaderboard',
	    users: users,
        logged_out: !req.session.logged_in
	  }
	);
  });
});

router.post("/mobile_login", validateMobileLogin);
router.post('/user_login', validateUserLogin);

function validateMobileLogin(req, res) {
  var valid = auth_helper.login_admin("tbp@ucsd.edu", req.body["pass_hash"]);

  res.status(200).json(valid);
}

function userLogin(req, res) {
  var loggedIn = req.session.logged_in; 
  if (loggedIn) {
    res.redirect("/me");
  } else {
    res.redirect("/leaderboard"); 
  }
}

function validateUserLogin(req, res) {
  var hash = auth_helper.hash(req.body["password"]);
  process.stdout.write("Logging in user " + hash + "... ");

  auth_helper.login_user(hash)
  .then(userId => {
    if (userId == -1) {
      console.log("failed");
      res.redirect("/leaderboard");
    } else {
      console.log("ok");
      req.session.logged_in = userId;
      res.redirect("/me"); //TODO: Use userId to store session
    }
  });
}

router.get('/event_create', eventForm);
router.post('/event_create', createEvent);

function eventForm(req, res) {
  res.render('event_create.html', {errCode:"false"});
}

function createEvent(req, res) {
  var body = req.body;
  var dateExp = /^(20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/;
  var date = body["eventDate"];
  var dateTime = body["eventDate"] + " " + body["eventTime"];

  if (dateExp.test(date)) {
    eventData.add(
      { name:     body["eventName"],
        datetime: dateTime,
        points:   body["eventPoints"],
        officer:  body["eventOfficer"],
        type:     body["eventCategory"],
        wildcard: body["eventWildcard"] === "on"
      }
    )
    .then(id => res.redirect("/admin#event-tab"));
  }
  else {
    res.render('event_create.html', {errCode:"true"});
  }


}

router.post('/event_delete', eventDelete);

function eventDelete(req, res) {
  var body = req.body;
  var id = body["d_id"];
  data.getEventAttendees(id, function(retrievedUsers) {
    if (retrievedUsers.length == 0) {
      data.deleteEventById(id,
          function() {
            res.redirect("/admin");
          });
    }
    else {
      console.log("Event not empty")
      res.redirect("/admin");
    }

  });
}

router.get('/event_view', eventView);

function eventView(req, res) {
  var id = req.query.v_id;

  var event = eventData.getById(id);
  var attendees = userEventData.getEventAttendees(id);
  var nonAttendees = userEventData.getEventNonAttendees(id);

  Promise.all([event, attendees, nonAttendees])
  .then(results => res.render('event_view.html',
    { event:    results[0],
      users:    results[1],
      addUsers: results[2],
      errCode: false
    }
  ));
}

router.post('/add_event_user', addUserToEvent);

function addUserToEvent(req, res) {
  var body = req.body;
  var e_id = body["e_id"];
  var points = Number(body["points"]);
  var u_id = body["addUserId"];

  eventData.getById(e_id)
  .then(event => { return {
      "id":           event.id,
      "pointsEarned": points,
      "type":         event.type
  };})
  .then(attendance => userEventData.addUserToEvent(u_id, attendance))
  .then(() => {
    var path = '?v_id=' + e_id;
    res.redirect('/event_view' + path);
  });
}

router.post('/add_user_event', addEventToUser);
function addEventToUser(req, res) {
  var body = req.body;
  var e_id = body["addEventId"];
  var u_id = body["u_id"];
  var points = Number(body["points"]);

  eventData.getById(e_id)
  .then(e => {
    var attendance = {
      "id": e.id,
      "pointsEarned": points,
      "type": e.type
    };

    return userEventData.addUserToEvent(u_id, attendance);
  })
  .then(() => res.redirect('/me'));
}

module.exports = router;

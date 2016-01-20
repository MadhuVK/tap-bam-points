const express = require('express');
const router = express.Router();
const data = require('../src/data.js');
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
  } else {
    const USER = req.session.logged_in; 
    data.getUserById(USER, function(user) {
      data.getUserAttendanceHistory(USER, function(history) {
        data.getEventsNotAttendedByUserID(user.id, function(events) {
          user.history = history;
          pointStats = historyAnalyze(history, user.memberStatus);
          res.render('user.html', {
            title: 'Your TBP profile', 
            user: user, 
            pointStats: pointStats, 
            unattendedEvents: events
          });
        });
      });
    });
  }
});

router.get('/leaderboard', function(req, res) {
  data.getUsers('tbp', function(users) {
    points.addDataToUsers(users, function () {
      res.render('leaderboard.html', { 
        title: 'Leaderboard', 
        users: users, 
        logged_out: !req.session.logged_in
      });
    });
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
  auth_helper.login_user(auth_helper.hash(req.body["password"]), function onLogin(userId) {

    console.log(userId);

    if (userId['id'] == -1) {
      res.redirect("/leaderboard");
    } else {
      console.log(userId)
      req.session.logged_in = userId['id']
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
  console.log(req.body);
  var body = req.body;
  var dateExp = /^(20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/;
  var date = body["eventDate"];
  var dateTime = body["eventDate"] + " " + body["eventTime"];

  if (dateExp.test(date)) {
    data.addEvent({name:body["eventName"], datetime:dateTime, points:body["eventPoints"], officer:body["eventOfficer"], type:body["eventCategory"]},
        function(id) {
          res.redirect("/admin")
        });

  }
  else {
    res.render('event_create.html', {errCode:"true"});
  }


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
  var id = req.param('v_id');
  data.getEventById(id, function(retrievedEvent) {
    data.getEventAttendees(id, function(retrievedUsers) {
      data.getEventNonAttendees(id, function(addUsers) {
        res.render('event_view.html', {event: retrievedEvent, users: retrievedUsers, addUsers:addUsers, errCode: false});
      });
    });
  });
}

router.post('/add_event_user', addUsertoEvent);

function addUsertoEvent(req, res) {
  var body = req.body;
  var e_id = body["e_id"];
  var points = Number(body["points"]);
  var u_id = body["addUserId"];
  console.log(body);


  data.getEventById(e_id, function(rEvent) {
    var attendance = {
      "id":rEvent.id,
      "name":rEvent.name,
      "datetime":rEvent.datetime,
      "points":points,
      "officer":rEvent.officer,
      "type":rEvent.type
    }
    data.addUserToEvent(u_id, attendance, function(){
    });

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

  data.getEventById(e_id, function(e) {

    var attendance = {
      "id": e.id,
      "name": e.name,
      "datetime": e.datetime,
      "points": points,
      "officer": e.officer,
      "type": e.type
    };

    data.addUserToEvent(u_id, attendance, function() {
      res.redirect('/me');
    });
  });
}

module.exports = router;

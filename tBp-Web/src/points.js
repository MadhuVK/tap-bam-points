// Compute point standings for an individual or for all users

var pool = require('./dbClient.js');
var jsonpatch = require('fast-json-patch');
var eventTypes = require('./eventTypes.js');

const unique = function(value, index, arr) {return arr.indexOf(value) === index;};

// Tack on points data to array of user objects
exports.addDataToUsers = function (users) {
  return exports.compute(undefined)
    .then(points => {
      var lookup = {};
      for (var i = 0; i < users.length; i++) {
        lookup[users[i].id] = i;
      }

      points.forEach(pointRecord => {
        var id = pointRecord.id;
        delete pointRecord.id;
        users[lookup[id]].points = pointRecord;
      });

      return users;
    });
};

// id defined: {'total': Number, 'academic': Number, 'social': Number, etc.}
// id undefined: [{'id': Number, 'total': Number, 'academic': Number, etc.}, ...]
// TODO: filter query for invalid events
exports.compute = function (userId) {
  var fields = "users.id, pointsEarned, user_event.type";
  return pool.query(
    "SELECT " + fields + " " +
    "FROM users LEFT OUTER JOIN (user_event JOIN events) " +
    "ON (users.id = user_event.userId AND events.id = user_event.eventId)")
  .then(history => {
    var points;
    if (userId === undefined)
      points = prepAllPoints(history);
    else {
      individualHistory = history.filter(rec => rec.id === userId);
      points = prepIndividualPoints(individualHistory);
    }

    return points;
  });
};

function prepAllPoints(history) {
  var userIds = history.map(a => a.id).filter(unique);
  console.log(userIds);
  var points = userIds.map(function(id) {
    var individualHistory = history.filter(a => a.id === id);
    var preppedUser = prepIndividualPoints(individualHistory);
    preppedUser.id = id;
    return preppedUser;
  });

  return points;
}

function prepIndividualPoints(history) {
  var points = {total: 0};

  for (var type in eventTypes) {
    var eventsOfSameType = history.filter(rec => rec.type === type);
    points[type] = eventsOfSameType.reduce((prev, curr) => prev + curr.pointsEarned, 0);
    points.total += points[type];
  }

  return points;
}
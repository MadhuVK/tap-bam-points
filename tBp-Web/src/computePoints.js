// Compute point standings for an individual or for all users

var dbClient = require('./dbClient.js');
var connection = dbClient.connection;
var jsonpatch = require('fast-json-patch');
var eventTypes = require('./eventTypes.js');

const unique = function(value, index, arr) {return arr.indexOf(value) === index;};
  
// id defined: {'total': Number, 'academic': Number, 'social': Number, etc.}
// id undefined: [{'id': Number, 'total': Number, 'academic': Number, etc.}, ...]
// TODO: filter query for invalid events
module.exports = function(userId, callback) {
  var fields = "user.id, tbp_event.points, tbp_event.type, user_event.eventPatch";
  connection.query(
    "SELECT " + fields + " " +
    "FROM (user RIGHT JOIN tbp_user on user.id=tbp_user.parentId) " +
    "LEFT OUTER JOIN (user_event JOIN tbp_event) " +
    "ON (user.id=user_event.userId AND tbp_event.parentId=user_event.eventId)",
    function (err, history) {
      if (err)
        throw err;
      
      for (var event of history) {
        if (event.eventPatch === null) continue;

        jsonpatch.apply(event, JSON.parse(event.eventPatch));
        delete event.eventPatch;
      }
      
      if (userId === undefined)
        prepAllPoints(history);
      else {
        individualHistory = history.filter(rec => rec.id === userId);
        prepIndividualPoints(individualHistory);
      }

      callback(points);
    }
  );
};

function prepAllPoints(history) {
  userIds = history.map(a => a.id).filter(unique);
  points = userIds.map(function(id) {
    individualHistory = history.filter(a => a.id === id);
    preppedUser = prepIndividualPoints(individualHistory);
    preppedUser.id = id;
    return preppedUser;
  });

  return points;
}

function prepIndividualPoints(history) {
  points = {total: 0};

  for (var type of Object.keys(eventTypes)) {
    eventsOfSameType = history.filter(rec => rec.type === type);
    points[type] = eventsOfSameType.reduce((prev, curr) => prev + curr.points, 0);
    points.total += points[type];
  }

  return points;
}
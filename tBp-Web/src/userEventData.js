var pool = require('./dbClient.js');
var jsonpatch = require('fast-json-patch');

exports.getUserAttendances = function (userId) {
  var fields = "eventId, name, pointsEarned, user_event.type, wildcard, datetime";
  return pool.query(
    "SELECT " + fields + " FROM events INNER JOIN user_event " +
    "WHERE events.id = user_event.eventId " +
    "AND userId = " + userId + " AND events.valid AND user_event.valid"
  );
};

exports.getEventsNotAttendedByUserId = function (id) {
  return pool.query(
    "SELECT * FROM events WHERE id NOT IN " +
    "(SELECT eventId FROM user_event WHERE userId = ?) AND valid",
    [id]
  );
};

exports.getEventAttendees = function (eventId) {
  return pool.query(
    "SELECT users.id, firstName, lastName FROM users INNER JOIN user_event " +
    "ON users.id = user_event.userId WHERE user_event.eventId = ? AND user_event.valid",
    [eventId]
  );
};

exports.getEventNonAttendees = function (eventId) {
  return pool.query(
    "SELECT id, firstName, lastName FROM users " +
    "WHERE id NOT IN (SELECT userId FROM user_event WHERE eventId = ? AND valid)",
    [eventId]);
};

exports.addUserToEvent = function (userId, attendance) {
  attendance.datetime = new Date(attendance.datetime);
  return pool.query(
    "INSERT INTO user_event (userId, eventId, pointsEarned, type) VALUES (?, ?, ?, ?)",
    [userId, attendance.id, attendance.pointsEarned, attendance.type]
  );
};

exports.getAttendance = function (userId, eventId) {
  return pool.query("SELECT * FROM user_event WHERE userId = ? AND eventId = ? AND valid")
    .then(result => result.length === 0 ? Promise.reject() : result[0]);
};

exports.patchAttendance = function (userId, eventId, patch) {
  return getUserEventAttendance(userId, eventId)
    .then(oldAttendance => jsonpatch.apply(oldAttendance, patch))
    .then(updateAttendance);
};

function updateAttendance(att) {
  return pool.query(
    "UPDATE user_event SET pointsEarned = ?, type = ? " +
    "WHERE userId = ? AND eventId = ?",
    [att.pointsEarned, att.type, att.userId, att.eventId]
  );
}

exports.deleteAttendance = function (userId, eventId) {
  return pool.query("UPDATE user_event SET valid = FALSE " +
    "WHERE userId = ? AND eventId = ?",
    [userId, eventId]
  );
};

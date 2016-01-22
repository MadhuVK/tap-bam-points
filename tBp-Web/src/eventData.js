var pool = require('./dbClient.js');
var jsonpatch = require('fast-json-patch');

exports.getAll = function () {
  return pool.query("SELECT * FROM events WHERE valid = TRUE");
};

exports.add = function (event) {
  var connection;
  return pool.getConnection()
    .then(c => {
      connection = c;
      return connection.beginTransaction();
    })
    .then(() => insertEventBase(connection, event))
    .then(result => {
      event.id = result.insertId;
      return insertEventExtensions(connection, event);
    })
    .then(() => connection.commit())
    .catch(() => connection.rollback())
    .then(() => pool.releaseConnection(connection))
    .then(() => event.id)
  ;
};

function insertEventBase(connection, event) {
  return connection.query(
    "INSERT INTO event_base (name, datetime) VALUES (?, ?)",
    [event.name, event.datetime]
  );
}

function insertEventExtensions(connection, event) {
  return connection.query(
    "INSERT INTO event_extensions " +
    "(parentId, points, officer, type, wildcard) VALUES (?, ?, ?, ?, ?)",
    [event.id, event.points, event.officer, event.type, event.wildcard]
  );
}

exports.getById = function (id) {
  return pool.query(
    "SELECT * FROM events WHERE events.id = ? AND valid", [id])
    .then(prepEvent);
};

function prepEvent(result) {
  if (result.length === 0) return Promise.reject();

  var event = result[0];
  delete event.parentId;
  delete event.valid;
  return event;
}

exports.patch = function (eventId, patch) {
  return exports.getEventById(eventId)
    .then(oldEvent => jsonpatch.apply(oldEvent, patch))
    .then(updateEvent);
};

function updateEvent(newEvent, afterUpdate) {
  return pool.query(
    "UPDATE events SET name = ?, datetime = ?, points = ?, officer = ?, type = ? " +
    "WHERE id = ?",
    [newEvent.name, newEvent.datetime, newEvent.points, newEvent.officer,
     newEvent.type, newEvent.id]
  );
}

exports.deleteById = function (id, afterDelete) {
  return pool.query("UPDATE events SET valid = FALSE WHERE id = ?", [id]);
};

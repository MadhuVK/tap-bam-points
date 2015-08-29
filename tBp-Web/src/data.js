var dbClient = require('./dbClient.js');
var connection = dbClient.connection;
var jsonpatch = require('fast-json-patch');

exports.getUsers = function(group, afterGet) {
  var groupTable = group + "_user";
  connection.query("SELECT * FROM user JOIN ?? WHERE user.id = ?? AND valid = true",
    [groupTable, groupTable + ".parentId"],
    function(err, rows, fields) {
      if (err) throw err;
      afterGet(rows);
  });
};

// TODO: currently: only can add users to tbp_user. How should we do multiple groups?
// afterAdd : function(userId)
exports.addUser = function(user, afterAdd) {
  connection.beginTransaction(function(err) {
    if (err) throw err;
    insertUserBasics(user, afterAdd, insertUserDetails);
  });
};

function insertUserBasics(user, afterAdd, callback) {
  connection.query(
    "INSERT INTO user (valid, lastName, firstName, barcodeHash) VALUES (true, ?, ?, ?)",
    [user.lastName, user.firstName, user.barcodeHash],
    function(err, result) {
      if (rollbackRequired(err))
        return;
      callback(user, result.insertId, afterAdd);
    }
  );
}

function insertUserDetails(user, parentId, afterAdd) {
  connection.query(
    "INSERT INTO tbp_user (parentId, house, memberStatus) VALUES (?, ?, ?)",
    [parentId, user.house, user.memberStatus],
    function(err, rows, fields) {
      if (rollbackRequired(err))
        return;

      connection.commit(function(err) {
        if (rollbackRequired(err))
          return;
        afterAdd(parentId);
      });
    }
  );
}

// afterGet : function(user)
exports.getUserById = function(id, afterGet) {
  connection.query(
    "SELECT * FROM user JOIN tbp_user WHERE user.id = ? AND user.id = tbp_user.parentId AND user.valid = true",
    [id],
    function(err, result) {
      if (err)
        throw err;
      var user = result[0];
      delete user.parentId;
      afterGet(user);
    }
  );
};

exports.updateUserByPatch = function(userId, patch, afterUpdate) {
  exports.getUserById(userId, function(oldUser) {
    jsonpatch.apply(oldUser, patch);
    var newUser = oldUser;
    updateUser(newUser, afterUpdate);
  });
};

function updateUser(newUser, afterUpdate) {
  connection.query(
    "UPDATE user JOIN tbp_user SET firstName = ?, lastName = ?, barcodeHash = ?, house = ?, memberStatus = ? " +
    "WHERE user.id = ? AND user.id = tbp_user.parentId",
    [newUser.firstName, newUser.lastName, newUser.barcodeHash, newUser.house, newUser.memberStatus, newUser.id],
    function(err) {
      if (err)
        throw err;
      afterUpdate();
    }
  );
}

exports.getUserAttendanceHistory = function(userId, afterGet) {
  var fields = "event.id, name, points, type, datetime, eventPatch";
  connection.query(
    "SELECT " + fields + " FROM event JOIN tbp_event JOIN user_event " +
    "WHERE event.id = tbp_event.parentId AND event.id = user_event.eventId " +
    "AND event.valid = true AND user_event.valid = true",
    function (err, history) {
      if (err)
        throw err;

      for (var event of history) {
        jsonpatch.apply(event, JSON.parse(event.eventPatch));
        delete event.eventPatch;
      }
      afterGet(history);
    }
  );
};

exports.deleteUserById = function(id, afterDelete) {
  connection.query("UPDATE user SET valid = false WHERE id = ?", [id], function(err) {
    if (err)
      throw err;
    afterDelete();
  });
};

exports.getEvents = function(group, afterGet) {
  var groupTable = group + "_event";
  connection.query("SELECT * FROM event JOIN ?? WHERE event.id = ?? AND event.valid = true",
    [groupTable, groupTable + ".parentId"],
    function(err, rows, fields) {
      if (err) throw err;
      afterGet(rows);
    }
  );
};

exports.addEvent = function(event, afterAdd) {
  connection.beginTransaction(function(err) {
    if (err)
      throw err;
    insertEventBasics(event, afterAdd, insertEventDetails);
  });
};

function insertEventBasics(event, afterAdd, callback) {
  connection.query(
    "INSERT INTO event (name, datetime) VALUES (?, ?)",
    [event.name, event.datetime],
    function(err, result) {
      if (rollbackRequired(err))
        return;
      callback(event, result.insertId, afterAdd);
    }
  );
}

function insertEventDetails(event, parentId, afterAdd) {
  connection.query(
    "INSERT INTO tbp_event (parentId, points, officer, type) VALUES (?, ?, ?, ?)",
    [parentId, event.points, event.officer, event.type],
    function(err) {
      if (rollbackRequired(err))
        return;

      connection.commit(function(err) {
        if (rollbackRequired(err))
          return;
        afterAdd(parentId);
      });
    }
  );
}

exports.getEventById = function(id, afterGet) {
  connection.query(
    "SELECT * FROM event JOIN tbp_event WHERE event.id = ? AND event.id = tbp_event.parentId AND valid = true",
    [id],
    function(err, result) {
      if (err)
        throw err;
      var event = result[0];
      delete event.parentId;
      afterGet(event);
  });
};

exports.updateEventByPatch = function(eventId, patch, afterUpdate) {
  exports.getEventById(eventId, function(oldEvent) {
    jsonpatch.apply(oldEvent, patch);
    var newEvent = oldEvent;
    updateEvent(newEvent, afterUpdate);
  });
};

function updateEvent(newEvent, afterUpdate) {
  connection.query(
    "UPDATE event JOIN tbp_event SET name = ?, datetime = ?, points = ?, officer = ?, type = ? " +
    "WHERE event.id = ? AND event.id = tbp_event.parentId",
    [newEvent.name, newEvent.datetime, newEvent.points, newEvent.officer, newEvent.type, newEvent.id],
    function(err) {
      if (err)
        throw err;
      afterUpdate();
    }
  );
}

// afterGet : function(attendees : Object[])
exports.getEventAttendees = function(id, afterGet) {
  connection.query(
    "SELECT user.id, firstName, lastName FROM user_event JOIN user WHERE user_event.eventId = ? AND user_event.valid = true",
    [id],
    function(err, result) {
      if (err)
        throw err;
      afterGet(result);
    }
  );
};

// afterAdd : function()
exports.addUserToEvent = function(userId, event, afterAdd) {
  exports.getEventById(event.id, function(eventTemplate) {
    var patch = jsonpatch.compare(eventTemplate, event);
    addUserToPatchedEvent(userId, event.id, patch, afterAdd);
  });
};

function addUserToPatchedEvent(userId, eventId, patch, afterAdd) {
  connection.query(
    "INSERT INTO user_event (userId, eventId, valid, eventPatch) VALUES (?, ?, true, ?)",
    [userId, eventId, JSON.stringify(patch)],
    function(err) {
      if (err)
        throw err;
      afterAdd();
    }
  );
}

exports.deleteEventById = function(id, afterDelete) {
  connection.query("UPDATE event SET valid = false WHERE id = ?", [id], function(err) {
    if (err)
      throw err;
    afterDelete();
  });
};

exports.getUserEventAttendance = function(userId, eventId, afterGet) {
  exports.getEventById(eventId, function(eventTemplate) {
    connection.query("SELECT eventPatch FROM user_event WHERE userId = ? AND eventId = ? AND valid = true",
      [userId, eventId], function(err, rows, fields) {
        if (err)
          throw err;
        var patch = rows[0].eventPatch;
        jsonpatch.apply(eventTemplate, JSON.parse(patch));
        delete eventTemplate.parentId;
        afterGet(eventTemplate);
      }
    );
  });
};

// afterUpdate : function(patchApplied)
exports.updateUserEventAttendanceByPatch = function(userId, eventId, eventPatch, afterUpdate) {
  connection.query(
    "UPDATE user_event SET eventPatch = ? WHERE userId = ? AND eventId = ?",
    [JSON.stringify(eventPatch), userId, eventId],
    function(err, rows) {
      if (err)
        throw err;
      afterUpdate(eventPatch);
    }
  );
};

exports.deleteUserEventAttendance = function(userId, eventId, afterDelete) {
  connection.query("UPDATE user_event SET valid = false WHERE userId = ? AND eventId = ?",
    [userId, eventId], function(err) {
    if (err)
      throw err;
    afterDelete();
  });
};

function rollbackRequired(err) {
  if (err) {
    connection.rollback(function() { throw err; });
    return true;
  }
  else
    return false;
}
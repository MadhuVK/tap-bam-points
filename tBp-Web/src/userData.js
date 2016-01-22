var pool = require('./dbClient.js');
var jsonpatch = require('fast-json-patch');

exports.getUsers = function () {
  return pool.query("SELECT * FROM users WHERE valid = TRUE");
};

exports.addUser = function (user) {
  var connection;
  return pool.getConnection()
    .then(c => {
      connection = c;
      return connection.beginTransaction();
    })
    .then(() => insertUserBase(connection, user))
    .then(result => {
      user.id = result.insertId;
      return insertUserExtensions(connection, user);
    })
    .then(() => connection.commit())
    .catch(() => connection.rollback())
    .then(() => pool.releaseConnection(connection))
    .then(() => user.id)
  ;
};

function insertUserBase(connection, user) {
  return connection.query(
    "INSERT INTO user_base (firstName, lastName, barcodeHash) VALUES (?, ?, ?)",
    [user.firstName, user.lastName, user.barcodeHash]
  );
}

function insertUserExtensions(connection, user) {
  return connection.query(
    "INSERT INTO user_extensions (parentId, house, memberStatus) VALUES (?, ?, ?)",
    [user.id, user.house, user.memberStatus]
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
      delete user.valid;
      delete user.parentId;
      afterGet(user);
    }
  );
};

exports.getUserByBarcode = function(bcode, afterGet) {
  var bhash = bcode;
  connection.query(
      "SELECT * FROM user JOIN tbp_user WHERE user.barcodeHash = ? AND user.id = tbp_user.parentId AND user.valid = true",
      [bhash],
      function(err, result) {
        if (err)
          throw err;
        var user;
        if(result.length != 0) {
          user = result[0];
          delete user.parentId;
        }
        else
          user = result;

        afterGet(user);
      }
  );
};

exports.getUserIdByHash = function(hash, afterGet) {
  connection.query("SELECT id FROM user WHERE barcodeHash = ? AND user.valid = true", [hash], function(err, result) {
    if (err) {
      throw err;
    }
    if (result.length == 0) {
      afterGet( {id: -1} );
    } else {
      afterGet(result[0]);
    }
  });
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
  var fields = "userId, event.id, name, points, type, datetime, eventPatch";
  connection.query(
    "SELECT " + fields + " FROM event JOIN tbp_event JOIN user_event " +
    "WHERE event.id = tbp_event.parentId AND event.id = user_event.eventId " +
    "AND userId = " + userId + " AND event.valid = true AND user_event.valid = true",
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

exports.getEventsNotAttendedByUserID = function(id, afterGet) {
  connection.query(
      "SELECT * FROM event where id not in (SELECT eventID from user_event where userId = ?) and valid",
      [id],
      function(err, result) {
        if(err)
          throw err;
        afterGet(result)
      });
};

exports.getEventById = function(id, afterGet) {
  connection.query(
    "SELECT * FROM event JOIN tbp_event WHERE event.id = ? AND event.id = tbp_event.parentId AND valid = true",
    [id],
    function(err, result) {
      if (err)
        throw err;
      var event = result[0];
      delete event.parentId;
      delete event.valid;
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
    "SELECT user.id, firstName, lastName FROM user_event JOIN user ON user.id = user_event.userId WHERE user_event.eventId = ? AND user_event.valid = true",
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
  event.datetime = new Date(event.datetime);
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
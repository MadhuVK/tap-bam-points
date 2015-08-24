var dbClient = require('./dbClient.js');
var jsonpatch = require('fast-json-patch');

exports.getUsers = function(group, afterGet) {
  var groupTable = group + "_user";
  dbClient.query("SELECT * FROM user JOIN ?? WHERE user.id = ??",
    [groupTable, groupTable + ".parentId"],
    function(err, rows, fields) {
      if (err) throw err;
      afterGet(rows);
  });
};

// TODO: currently: only can add users to tbp_user. How should we do multiple groups?
// afterAdd : function(userId)
exports.addUser = function(user, afterAdd) {
  dbClient.beginTransaction(function(err) {
    if (err) throw err;
    insertUserBasics(user, afterAdd, insertUserDetails);
  });
};

function insertUserBasics(user, afterAdd, callback) {
  dbClient.query(
    "INSERT INTO user (valid, lastName, firstName, barcodeHash) VALUES (?, ?, ?, ?)",
    [true, user.lastName, user.firstName, user.barcodeHash],
    function(err, result) {
      if (rollbackRequired(err))
        return;
      callback(user, result.insertId, afterAdd);
    }
  );
}

function insertUserDetails(user, parentId, afterAdd) {
  dbClient.query(
    "INSERT INTO tbp_user (parentId, house, memberStatus) VALUES (?, ?, ?)",
    [parentId, user.house, user.memberStatus],
    function(err, rows, fields) {
      if (rollbackRequired(err))
        return;

      dbClient.commit(function(err) {
        if (rollbackRequired(err))
          return;
        afterAdd(parentId);
      });
    }
  );
}

// afterGet : function(user)
exports.getUserById = function(id, afterGet) {
  dbClient.query(
    "SELECT * FROM user JOIN tbp_user WHERE user.id = ? AND user.id = tbp_user.parentId",
    [id],
    function(err, result) {
      if (err)
        throw err;
      afterGet(result[0]);
    }
  );
};

exports.deleteUserById = function(id, afterDelete) {
  dbClient.query("UPDATE user SET valid = false WHERE id = ?", [id], function(err) {
    if (err)
      throw err;
    afterDelete();
  });
};

exports.getEvents = function(group, afterGet) {
  var groupTable = group + "_event";
  dbClient.query("SELECT * FROM event JOIN ?? WHERE event.id = ??",
    [groupTable, groupTable + ".parentId"],
    function(err, rows, fields) {
      if (err) throw err;
      afterGet(rows);
    }
  );
};

exports.addEvent = function(event, afterAdd) {
  dbClient.beginTransaction(function(err) {
    if (err)
      throw err;
    insertEventBasics(event, afterAdd, insertEventDetails);
  });
};

function insertEventBasics(event, afterAdd, callback) {
  dbClient.query(
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
  dbClient.query(
    "INSERT INTO tbp_event (parentId, points, officer, type) VALUES (?, ?, ?, ?)",
    [parentId, event.points, event.officer, event.type],
    function(err) {
      if (rollbackRequired(err))
        return;

      dbClient.commit(function(err) {
        if (rollbackRequired(err))
          return;
        afterAdd(parentId);
      });
    }
  );
}

exports.getEventById = function(id, afterGet) {
  dbClient.query(
    "SELECT * FROM event JOIN tbp_event WHERE event.id = ? AND event.id = tbp_event.parentId",
    [id],
    function(err, result) {
      if (err)
        throw err;
      afterGet(result[0]);
  });
};

exports.deleteEventById = function(id, afterDelete) {
  dbClient.query("UPDATE event SET valid = false WHERE id = ?", [id], function(err) {
    if (err)
      throw err;
    afterDelete();
  });
};

function rollbackRequired(err) {
  if (err) {
    dbClient.rollback(function() { throw err; });
    return true;
  }
  else
    return false;
}
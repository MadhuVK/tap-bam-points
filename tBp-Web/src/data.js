var dbClient = require('./dbClient.js');

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
      if (err) {
        return dbClient.rollback(function() {
          throw err;
        });
      }

      callback(user, result.insertId, afterAdd);
    }
  );
}

function insertUserDetails(user, parentId, afterAdd) {
  dbClient.query(
    "INSERT INTO tbp_user (parentId, house, memberStatus) VALUES (?, ?, ?)",
    [parentId, user.house, user.memberStatus],
    function(err, rows, fields) {
      if (err) {
        return dbClient.rollback(function() {
          throw err;
        });
      }

      dbClient.commit(function(err) {
        if (err) {
          return connection.rollback(function() {
            throw err;
          });
        }

        afterAdd(user.id);
      });
    }
  );
}

// afterGet : function(user)
exports.getUserById = function(id, afterGet) {
  dbClient.query("SELECT * FROM user JOIN tbp_user " +
                 "WHERE user.id = ? AND user.id = tbp_user.parentId",
                 [id], function(err, result) {
    if (err) throw err;

    afterGet(result);
  });
};

// afterDelete : function()
exports.deleteUserById = function(id, afterDelete) {
  dbClient.query("UPDATE user SET valid = false WHERE id = ?", [id], function(err) {
    if (err) throw err;

    afterDelete();
  });
};
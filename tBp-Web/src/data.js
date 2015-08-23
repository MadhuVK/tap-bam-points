var dbClient = require('./dbClient.js');

exports.getUsers = function(group, afterGet) {
  var groupTable = group + "_user";
  dbClient.query("SELECT * FROM user JOIN ?? WHERE user.primary_key = ??",
    [groupTable, groupTable + ".parent_key"],
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
    "INSERT INTO user (user_id, valid, last_name, first_name, barcode_hash) VALUES (?, ?, ?, ?, ?)",
    [user.user_id, true, user.last_name, user.first_name, user.barcode_hash],
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

function insertUserDetails(user, parentKey, afterAdd) {
  dbClient.query(
    "INSERT INTO tbp_user (parent_key, house_color, member_status) VALUES (?, ?, ?)",
    [parentKey, user.house_color, user.member_status],
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

        afterAdd(user.user_id);
      });
    }
  );
}

// afterGet : function(user)
exports.getUserById = function(id, afterGet) {
  dbClient.query("SELECT * FROM user JOIN tbp_user " +
                 "WHERE user.primary_key = tbp_user.parent_key AND user.user_id = ?",
                 [id], function(err, result) {
    if (err) throw err;

    afterGet(result);
  });
};

// afterDelete : function()
exports.deleteUserById = function(id, afterDelete) {
  dbClient.query("DELETE FROM user WHERE user_id = ?", [id], callback);
};
var pool = require('./dbClient.js');
var auth_helper = require('./auth_helper.js');
var jsonpatch = require('fast-json-patch');
//var hashFunction = require('./auth_helper.js').hash;

exports.getAll = function () {
  return pool.query("SELECT * FROM users WHERE valid = TRUE");
};

// TODO: extract this into a higher-order function to add both users and events
// first, seek advice on how to restructure this
exports.add = function (user) {
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

exports.getById = function (id) {
  return pool.query(
    "SELECT * FROM users WHERE id = ? AND valid = TRUE",
    [id])
    .then(prepUser);
};

exports.getByHash = function (hash) {
  return pool.query(
    "SELECT * FROM users WHERE barcodeHash = ? AND valid = TRUE",
    [hash])
    .then(prepUser);
};

exports.getByBarcode = function (bcode) {
  var bhash = auth_helper.hash(bcode);
  return exports.getByHash(bhash);
};

// TODO: extract this, too
function prepUser(result) {
  if (result.length === 0) return Promise.reject('User not found');

  var user = result[0];
  delete user.valid;
  delete user.parentId;
  return user;
}

exports.patch = function (userId, patch) {
  return exports.getUserById(userId)
    .then(oldUser => jsonpatch.apply(oldUser, patch))
    .then(updateUser);
};

function updateUser(newUser) {
  return pool.query(
    "UPDATE users SET firstName = ?, lastName = ?, barcodeHash = ?, house = ?, memberStatus = ? " +
    "WHERE id = ?",
    [newUser.firstName, newUser.lastName, newUser.barcodeHash, newUser.house, newUser.memberStatus, newUser.id]
  );
}

exports.deleteById = function (id) {
  return pool.query("UPDATE user SET valid = FALSE WHERE id = ?", [id]);
};

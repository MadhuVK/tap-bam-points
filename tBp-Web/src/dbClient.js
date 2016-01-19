var mysql = require('mysql');

var totalConnections = 0;
var totalEnqueues = 0;

var connectOptions = {
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tBp'
};

var pool = mysql.createPool(connectOptions);

// connected : Promise Function(connection)
var connect = function (connected) {
  var connection;
  return new Promise((resolve, reject) => {
    pool.getConnection((err, newConnection) => {
      if (err) reject(err);
      connection = newConnection;
      resolve(connection);
    });
  })
  .then(connected)
  .then(value => {
    connection.release();
    return Promise.resolve(value);
  })
  .catch(err => {throw err;});
};

module.exports = connect;

var logPrefix = '[db pool] ';
pool.on('connection', function(connection) {
  console.log(logPrefix + 'Connections in pool: ' + ++totalConnections);
  console.log(logPrefix + 'New connection id: ' + connection.threadId);
});
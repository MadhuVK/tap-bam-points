var mysql = require('promise-mysql');

var poolConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tBp',
  connectionLimit: 50
};

var pool = mysql.createPool(poolConfig);
module.exports = pool;

var totalConnections = 0;

var logPrefix = '[db pool] ';
pool.on('connection', function(connection) {
  console.log(logPrefix + 'Added connection (id ' + connection.threadId +
    '), total ' + ++totalConnections);
});

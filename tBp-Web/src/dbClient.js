var mysql = require('mysql');

//TODO: Build up from metadata
// May not need this anymore
var dbMap = {
    "tbp" : {
        "user": {
            "house_color": "tbp_user",
            "member_status": "tbp_user",
            "last_name": "user",
            "first_name": "user",
            "barcode_hash": "user"
        },
        "event": {
            "event_type": "tbp_event",
            "officer": "tbp_event",
            "default_points": "tbp_event",
            "datetime": "event",
            "name": "event",
            "valid": "event"
        }
    }
};

var totalConnections = 0;
var totalEnqueues = 0;
var connectOptions = {
  connectionLimit: 50,
  host: "localhost",
  user: "root",
  password: "",
  database: 'tBp'
};

var pool = mysql.createPool(connectOptions);
var connection = mysql.createConnection(connectOptions);

exports.pool = pool;
exports.connection = connection;

pool.on('connection', function(connection) {
    console.log('Total Connections Available: ' + ++totalConnections);
    console.log('Connection id: ' + connection.threadId);
});

pool.on('enqueue', function() {
    console.log('Total Enqueues' + ++totalEnqueues);
});

/* USAGE: TODO
 */

exports.db_select = function(columns, tables, conditions) {
    console.log("Issuing SELECT");
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error("Error on establishing connection");
            throw err;
        }

        connection.release();
    });

    return {};
};

exports.db_insert = function() {
    console.log("Issuing INSERT");
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error("Error on establishing connection");
            throw err;
        }
        connection.release();
    });

    return {};
};

exports.db_update = function() {
    console.log("Issuing UPDATE");
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error("Error on Establishing connection");
            throw err;
        }
        connection.release();
    });

    return {};
};

// We shouldn't have to use this, since we're doing lazy deletion
exports.db_delete = function() {
    console.log("Issuing DELETE");
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error("Error on Establishing connection");
            throw err;
        }
        connection.release();
    });

    return {};
};

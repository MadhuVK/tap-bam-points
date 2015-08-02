var mysql = require('mysql');
//TODO: Build up from metadata

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

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'tBp'
});

connection.connect(function(err) {
    if (err) {
        console.error("Begin error");
        console.error("error connection: " + err.stack);
        console.error("End error");
        return;
    }

    console.log("WORKS FLAWLESSLY");
});

module.exports = connection;


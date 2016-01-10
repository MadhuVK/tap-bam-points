const data = require("./data.js");
const crypto = require("crypto");
const request = require('request');

const captchaSite = "6LfuTg4TAAAAABkpca63EfsbuSIZk7egO8EYRIOG";
exports.captchaSite = captchaSite;

const captchaSecret = "6LfuTg4TAAAAAIKMgPpnkYEM6zcLhEbTB0oIqOnv";
exports.captchaSecret = captchaSecret;

exports.validate_captcha = function(req, captcha_secret, callback) {
    request.post(
        "https://www.google.com/recaptcha/api/siteverify",
        { form: {"secret": captcha_secret, "response": req.body["g-recaptcha-response"] } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var b = JSON.parse(response.body);
                if (b["success"] == true) {
                    return callback(true);
                }
            }
            return callback(false);
        }
    );
};

exports.login_admin = function(user, pass) {
    console.log("Trying to log in admin...");

    var tbp_admin = "tbp@ucsd.edu";
    var password_hash = "efbfe5984089c587c0372dff84464fcc";

    var valid_user = user == tbp_admin;
    var valid_password = crypto.createHash('md5').update(pass).digest('hex') == password_hash;

    console.log(valid_user);
    console.log(valid_password);

    return valid_user && valid_password;
};

exports.login_user = function(pass, afterLogin) {
    console.log("Trying to log in user...");

    var password_hash = crypto.createHash('md5').update(pass).digest('hex');
    console.log(password_hash)

    data.getUserIdByHash(pass, afterLogin);
};


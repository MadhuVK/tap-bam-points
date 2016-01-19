//const data = require("./data.js");
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

exports.login_admin = function(user, pass_hash) {
    console.log("Trying to log in admin...");

    var tbp_admin = "tbp@ucsd.edu";
    var hash_compare =
        "e363befcffda20881b47efc26f2a7f1a301d7bee9a1d9c45034e206aa7cc12d6";

    var valid_user = user.trim().toLowerCase() == tbp_admin;
    var valid_password = pass_hash.toLowerCase().replace("-", "") == hash_compare;

    console.log(valid_user);
    console.log(valid_password);

    return valid_user && valid_password;
};

exports.hash = function(data) {
    return crypto.createHash('sha256').update(pass).digest('hex')
}

exports.login_user = function(pass_hash, afterLogin) {
    console.log("Trying to log in user...");
    console.log(pass_hash);

    data.getUserIdByHash(pass_hash.toLowerCase(), afterLogin);
};


const userData = require("./userData.js");
const crypto = require("crypto");
const request = require('request');
const jwt = require('jsonwebtoken');
const config = require('../bin/config')[process.env.NODE_ENV];

const captchaSite = "6LfuTg4TAAAAABkpca63EfsbuSIZk7egO8EYRIOG";
const captchaSecret = "6LfuTg4TAAAAAIKMgPpnkYEM6zcLhEbTB0oIqOnv";


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
    var valid_password = pass_hash.toLowerCase().replace(/-/g, "") == hash_compare;

    return valid_user && valid_password;
};

exports.hash = function(data) {
    return crypto.createHash('sha256').update(data).digest('hex')
}

exports.login_user = function(pass_hash) {
    return userData.getIdByHash(pass_hash.toLowerCase())
      .catch(() => -1);
};

// This middleware attaches to / . Every request gets its attached JWT
// evaluated for validity. If valid, req.loggedIn = true and req.token
// is the payload of the JWT.
exports.checkToken = function (req, res, next) {
  var token = req.cookies.token;

  if (!token) {
    req.loggedIn = false;
    return next();
  }

  jwt.verify(token, config.jwt_secret, (err, decoded) => {
    if (err) {
      console.log('[auth] Rejected token: ' + JSON.stringify(err));
      req.loggedIn = false;
      return next();
    }

    req.loggedIn = true;
    req.token = jwt.decode(token);
    return next();
  });
}

exports.captchaSite = captchaSite;
exports.captchaSecret = captchaSecret;


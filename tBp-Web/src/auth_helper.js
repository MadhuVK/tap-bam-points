const config = require('../bin/config')[process.env.NODE_ENV];
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const request = require('request');
const userData = require('./userData');

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

// This middleware attaches to / . Every request gets its attached JWT
// evaluated for validity. If valid, req.loggedIn = true and req.jwt
// is the payload of the JWT.
exports.checkToken = function (req, res, next) {
  var token = req.cookies.jwt;

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
    req.jwt = jwt.decode(token);
    return next();
  });
}

exports.addJwtToResponse = function (res, user) {
  var token = jwtForUser(user);
  res.append('Set-Cookie', `jwt=${token}; HttpOnly`);
}

function jwtForUser(user) {
  var options = {
    expiresIn: '7d',
    subject: user.id,
    jwtid: crypto.randomBytes(64).toString('base64'),
  };

  var payload = {
    admin: user.memberStatus == 'officer',
  }

  return jwt.sign(payload, config.jwt_secret, options);
}

exports.captchaSite = captchaSite;
exports.captchaSecret = captchaSecret;


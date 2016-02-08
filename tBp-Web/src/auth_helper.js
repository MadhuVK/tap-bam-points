const config = require('../bin/config')[process.env.NODE_ENV];
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const request = require('request-promise');
const userData = require('./userData');

const STATUS_CODES = require('http').STATUS_CODES;
const captchaSite = "6LfuTg4TAAAAABkpca63EfsbuSIZk7egO8EYRIOG";
const captchaSecret = "6LfuTg4TAAAAAIKMgPpnkYEM6zcLhEbTB0oIqOnv";


exports.validate_captcha = function(req, captcha_secret) {
  var options = {
    method: 'POST',
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    resolveWithFullResponse: true,
    form: {
      'secret': captcha_secret,
      'response': req.body['g-recaptcha-response'],
    }
  };

  return request(options)
    .then(response => {
      var sc = response.statusCode;

      if (sc !== 200)
        return Promise.reject(`${sc} ${STATUS_CODES[sc]}`);

      if (JSON.parse(response.body).success !== true)
        return Promise.reject('Captcha failed');

      return Promise.resolve();
    })
    .catch(err => Promise.reject(`Captcha authority response: ${err}`));
};

exports.check_admin_credentials = function(user, pass) {
    var pass_hash = exports.hash(pass);

    var tbp_admin = "tbp@ucsd.edu";
    var hash_compare =
        "e363befcffda20881b47efc26f2a7f1a301d7bee9a1d9c45034e206aa7cc12d6";

    var valid_user = user.trim().toLowerCase() == tbp_admin;
    var valid_password = pass_hash.toLowerCase().replace(/-/g, "") == hash_compare;

    return (valid_user && valid_password)
      ? Promise.resolve()
      : Promise.reject('Incorrect username or password');
};

exports.hash = function(data) {
    return crypto.createHash('sha256').update(data).digest('hex')
}

// This middleware attaches to / . Every request gets its attached JWT
// evaluated for validity. If valid, req.loggedIn = true and req.jwt
// is the payload of the JWT.
exports.checkToken = function (req, res, next) {
  var token = req.cookies.jwt;
  req.jwt = {};

  if (token) {
    try {
      jwt.verify(token, config.jwt_secret);
      req.loggedIn = true;
      req.jwt = jwt.decode(token);
    }
    catch (err) {
      console.log(`[auth] Rejected token: ${err.message}`);
      req.loggedIn = false;
    }
  }

  // TODO: jwt_admin is a temporary separate JWT to convey admin status
  // If it is present and valid, forcibly set req.jwt.admin to true
  // When the standalone admin login is removed, this will be removed
  if (req.cookies.jwt_admin) {
    try {
      jwt.verify(req.cookies.jwt_admin, config.jwt_secret);
      req.jwt.admin = true;
    }
    catch (err) {
      console.log(`[auth] Rejected jwt_admin token: ${err.message}`);
    }
  }

  next();
}

exports.addJwtToResponse = function (res, user) {
  var token = jwtForUser(user);
  res.append('Set-Cookie', `jwt=${token}; HttpOnly`);
}

// See above for note about this temporary logic
exports.addAdminJwtToResponse = function (res) {
  var options = {
    expiresIn: '7d',
    jwtid: crypto.randomBytes(64).toString('base64'),
  };

  var admin_token = jwt.sign({}, config.jwt_secret, options);
  res.append('Set-Cookie', `jwt_admin=${admin_token}; HttpOnly`);
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


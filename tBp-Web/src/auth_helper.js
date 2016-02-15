const config = require('../bin/config')[process.env.NODE_ENV];
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const request = require('request-promise');
const userData = require('./userData');

const STATUS_CODES = require('http').STATUS_CODES;
const captchaSite = "6LfuTg4TAAAAABkpca63EfsbuSIZk7egO8EYRIOG";
const captchaSecret = "6LfuTg4TAAAAAIKMgPpnkYEM6zcLhEbTB0oIqOnv";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
};

// Returns a middleware to be attached to API routes to restrict access
// on the basis of membership to any of the following groups:
//  - admin
//  - owner (i.e., a user seeing his/her own data)
// @param groups is an array like ['admin', 'owner']
exports.acl = function (groups) {
  return (req, res, next) => {
    for (group of groups) {
      switch (group) {
        case 'admin':
          if (req.jwt.admin) return next();
          break;
        case 'owner':
          var id = (req.baseUrl + req.path).match(/users\/(\d+)/)[1];
          if (id == req.jwt.sub) return next();
          break;
        default:
          console.log(`Invalid group in ACL: ${group}`);
      }
    };

    return res.status(403).json({
      success: false,
      message: 'Insufficient privileges to access this resource'
    });
  };
}

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
// evaluated for validity. If valid, req.jwt is the payload of the JWT and
// req.loggedIn is set to true iff the payload had a user ID in the sub field
exports.checkToken = function (req, res, next) {
  var token = req.cookies.jwt;
  req.jwt = {};

  if (token) {
    try {
      jwt.verify(token, config.jwt_secret);
      req.jwt = jwt.decode(token);
      if (req.jwt.sub)
        req.loggedIn = true;
    }
    catch (err) {
      console.log(`[auth] Rejected token: ${err.message}`);
      req.loggedIn = false;
    }
  }

  next();
}

exports.addJwtToResponse = function (res, user) {
  var token = jwtForUser(user);
  res.cookie('jwt', token, COOKIE_OPTIONS);
}

// For the standalone admin login at /admin
exports.addAdminJwtToResponse = function (res) {
  var admin_token = exports.getAdminToken();
  res.cookie('jwt', admin_token, COOKIE_OPTIONS);
}

exports.getAdminToken = function () {
  var options = {
    expiresIn: '7d',
    jwtid: crypto.randomBytes(64).toString('base64'),
  };

  return jwt.sign({admin: true}, config.jwt_secret, options);
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


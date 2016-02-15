var express = require('express');
var router = express.Router();
var config = require('../bin/config')[process.env.NODE_ENV]
var jwt = require('jsonwebtoken'); 

var auth_helper = require('../src/auth_helper'); 

router.use(requireJwt);

// Checks for token from cookie or x-access-token, in that order
// Respond with an error if no valid JWT is given.
function requireJwt(req, res, next) {
  // Token was supplied via cookie (e.g., browsing the API)
  // and was validated by checkToken() when the request came in
  if (Object.keys(req.jwt).length !== 0)
    return next();

  var token = req.headers['x-access-token'];

  // Neither x-access-token nor jwt cookie provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  // x-access-token was provided
  try {
    var payload = jwt.verify(token, config.jwt_secret);
    if (payload.admin)
      req.jwt = { admin: true };
    next();
  }
  catch (err) {
    return res.status(401).json({
      success: false,
      message: `Token verification failed: ${err.message}`
    });
  }
}

// API endpoint for admin clients to acquire a JWT that indicates
// admin privileges. Uses same login as the admin login page.
// ex.: curl --data "pass=<pass>" https://<host>/api/authenticate
router.route('/authenticate')
  .post(function (req, res) {
    auth_helper.check_admin_credentials('tbp@ucsd.edu', req.body['pass'])
    .then(() => {
      var admin_token = auth_helper.getAdminToken();
      res.status(200).json({
        success: true, 
        token: admin_token
      });
    })
    .catch(err => {
      res.status(401).json({
        success: false, 
        error: err
      });
    });
  });

module.exports = router;

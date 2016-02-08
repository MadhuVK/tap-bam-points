var express = require('express');
var router = express.Router();
var config = require('../bin/config')[process.env.NODE_ENV]
var jwt = require('jsonwebtoken'); 

var auth_helper = require('../src/auth_helper'); 

router.route('/authenticate')
  .post(function (req, res) {
    auth_helper.check_admin_credentials('tbp@ucsd.edu', req.body['pass'])
    .then(() => {
      var jwt_token = jwt.sign({user: 'tbp@ucsd.edu'} , config.jwt_secret);
      res.status(200).json({
        success: true, 
        token: jwt_token
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

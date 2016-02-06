var express = require('express');
var router = express.Router();
var config = require('../bin/config')[process.env.NODE_ENV]
var jwt = require('jsonwebtoken'); 

var auth_helper = require('../src/auth_helper'); 

router.route('/authenticate')
  .post(function (req, res) {
    var valid = auth_helper.login_admin("tbp@ucsd.edu", req.body["pass_hash"]); 

    if (valid) {
      var jwt_token = jwt.sign({user: "tbp@ucsd.edu"} , config.jwt_secret); 
      res.status(200).json({
        success: true, 
        token: jwt_token
      }); 
    } else {
      res.status(403).json({
        success: false, 
        error: "Invalid Authentication"
      }); 
    }
  });


module.exports = router;

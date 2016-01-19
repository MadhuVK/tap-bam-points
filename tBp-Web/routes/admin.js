var auth_helper = require("../src/auth_helper");
var data = require('../src/data'); 
var points = require('../src/points.js'); 

var express = require('express'); 
var router = express.Router(); 


function manage_admin(req, res) {
  var loggedIn = req.session.admin_user; 

  if (loggedIn) {
    data.getUsers('tbp', function(retrievedUsers) {
      data.getEvents('tbp', function(retrievedEvents) {
        points.addDataToUsers(retrievedUsers, function() {
          res.render('admin_console.html',
            { title: 'Admin Console',
              users: retrievedUsers,
              events: retrievedEvents
            });
        });
      });
    });
  } else {
    res.render('admin_login.html', {sitekey: auth_helper.captchaSite});
  }
}


function validateAdminLogin(req, res) {
  auth_helper.validate_captcha(req, auth_helper.captchaSecret, function onValidate(valid_captcha) {
    if (valid_captcha) {
      if (auth_helper.login_admin(req.body["user"], auth_helper.hash(req.body["password"]))) {
        req.session.admin_user = true;
      }
    }
    res.redirect("/admin"); 
  });
}

router.post('/', validateAdminLogin); 
router.get('/', manage_admin); 

module.exports = router

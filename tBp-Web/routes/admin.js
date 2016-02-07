var auth_helper = require("../src/auth_helper");
var userData = require('../src/userData.js'); 
var eventData = require('../src/eventData.js');
var userEventData = require('../src/userEventData.js');
var points = require('../src/points.js'); 

var express = require('express'); 
var router = express.Router(); 


function manage_admin(req, res, next) {
  var loggedIn = req.session.admin_user; 

  if (!loggedIn) {
    res.render('admin_login.html', {sitekey: auth_helper.captchaSite});
    next();
  }
  
  var users = userData.getAll().then(points.addDataToUsers);
  var events = eventData.getAll();

  Promise.all([users, events])
  .then(results => {
	res.render('admin_console.html',
	  { title: 'Admin Console',
		users: results[0],
		events: results[1].sort(eventData.reverseChronological)
	  }
	);
  });
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

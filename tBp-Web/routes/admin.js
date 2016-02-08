var auth_helper = require("../src/auth_helper");
var userData = require('../src/userData.js'); 
var eventData = require('../src/eventData.js');
var userEventData = require('../src/userEventData.js');
var points = require('../src/points.js'); 

var express = require('express'); 
var router = express.Router(); 


function manage_admin(req, res, next) {
  if (!req.jwt.admin) {
    res.render('admin_login.html', {sitekey: auth_helper.captchaSite});
    next();
  }
  
  var users = userData.getAll().then(points.addDataToUsers);
  var events = eventData.getAll();

  Promise.all([users, events])
  .then(results => {
    res.render('admin_console.html', {
      title: 'tBp Admin Console',
      users: results[0],
      events: results[1].sort(eventData.reverseChronological)
      }
    );
  });
}

function validateAdminLogin(req, res) {
  var username = req.body['user'];
  var password = req.body['password'];

  auth_helper.validate_captcha(req, auth_helper.captchaSecret)
  .then(() => auth_helper.check_admin_credentials(username, password))
  .then(() => {
    console.log('[auth] Admin logged in');
    auth_helper.addAdminJwtToResponse(res);
  })
  .catch(err => console.log(`[auth] Admin login failed: ${err}`))
  .then(() => res.redirect('/admin'));
}

router.post('/', validateAdminLogin); 
router.get('/', manage_admin); 

module.exports = router

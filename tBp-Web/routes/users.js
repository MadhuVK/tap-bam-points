var express = require('express');
var router = express.Router();
var userData = require('../src/userData.js');
var userEventData = require('../src/userEventData.js');
var acl = require('../src/auth_helper.js').acl;

var jwt = require('jsonwebtoken'); 
var config = require('../bin/config')[process.env.NODE_ENV]

router.route('/')
  .get(acl(['admin']), function (req, res) {
    userData.getAll()
    .then(users => res.status(200).json(users));
  })

  .post(acl(['admin']), function (req, res) {
    userData.add(req.body)
    .then(userId => res.status(201).json({'id': userId}));
  });

router.route('/:user_id')
  .get(acl(['admin', 'owner']), function (req, res) {
    userData.getById(req.params.user_id)
    .then(user => res.status(200).json(user))
    .catch(err => { console.log(err) ;res.sendStatus(404);});
  })

  .patch(acl(['admin']), function (req, res) {
    var patch = req.body;
    userData.patch(req.params.user_id, patch)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(404));
  })

  .delete(acl(['admin']), function (req, res) {
    userData.deleteById(req.params.user_id)
    .then(() => res.sendStatus(200));
  });

router.route('/:user_id/events')
  .get(acl(['admin', 'owner']), function (req, res) {
    userEventData.getUserAttendances(req.params.user_id)
    .then(history => res.json(history));
  });

router.route('/:user_id/events/:event_id')
  .get(acl(['admin', 'owner']), function (req, res) {
    userEventData.getAttendance(req.params.user_id, req.params.event_id)
    .then(attendance => res.json(attendance));
  })

  .put(acl(['admin']), function (req, res) {
    userEventData.addUserToEvent(req.params.user_id, req.body)
    .then(() => res.sendStatus(201));
  })

  .patch(acl(['admin', 'owner']), function (req, res) {
    var eventPatch = req.body;
    if (!req.jwt.admin &&
      (eventPatch.length !== 1 || eventPatch[0].path !== '/type')) {

      res.sendStatus(403);
    }
    else {
      userEventData.patchAttendance(req.params.user_id, req.params.event_id, eventPatch)
      .then(() => res.sendStatus(200));
    }
  })

  .delete(acl(['admin']), function (req, res) {
    userEventData.deleteAttendance(req.params.user_id, req.params.event_id)
    .then(() => res.sendStatus(200));
  });

module.exports = router;

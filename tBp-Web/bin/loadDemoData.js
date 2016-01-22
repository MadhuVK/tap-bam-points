// run with `node demoData.js` to add some records to your tBp database

var data = require('./demo.js');
var userData = require('../src/userData.js');
var eventData = require('../src/eventData.js');
var userEventData = require('../src/userEventData.js');

function chain(arr, fun) {
  return arr.reduce((prev, curr) => prev.then(() => fun(curr)), Promise.all([]));
}

var x = 0;
function assign(attendance) {
  return userEventData.addUserToEvent(x++ % data.users.length + 1, attendance);
}

chain(data.users, userData.add)
.then(() => chain(data.events, eventData.add))
.then(() => chain(data.attendances, assign))
.then(() => chain(data.attendances, assign))
.then(() => chain(data.attendances, assign))
.then(process.exit);
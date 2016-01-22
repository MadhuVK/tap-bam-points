// run with `node demoData.js` to add some records to your tBp database

var data = require('./demo.js');
var userData = require('../src/userData.js');

function chain(arr, fun) {
  return arr.reduce((prev, curr) => prev.then(() => fun(curr)), Promise.all([]));
}

chain(data.users, userData.addUser)
.then(process.exit);
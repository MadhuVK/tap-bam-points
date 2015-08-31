// run with `node demoData.js` to add some records to your tBp database

var data = require('../src/data.js');

var people = [
  {
    "firstName": "Antonio",
    "lastName": "Ngonye",
    "barcodeHash": "123",
    "house": "red",
    "memberStatus": "initiate"
  },
  {
    "firstName": "Mel",
    "lastName": "D",
    "barcodeHash": "456",
    "house": "blue",
    "memberStatus": "active"
  },
  {
    "firstName": "Mad",
    "lastName": "Brown Dog",
    "barcodeHash": "789",
    "house": "red",
    "memberStatus": "inactive"
  },
  {
    "firstName": "Spencer",
    "lastName": "Beard",
    "barcodeHash": "090",
    "house": "green",
    "memberStatus": "officer"
  }
];
var events = [
  {
    "name": "The Chocolate Room",
    "datetime": "2015-10-01 10:30:00",
    "points": 1,
    "officer": "Augustus Gloop",
    "type": "social"
  },
  {
    "name": "The Inventing Room",
    "datetime": "2015-10-01 10:50:00",
    "points": 2,
    "officer": "Violet Beauregarde",
    "type": "academic"
  },
  {
    "name": "The Egg Room",
    "datetime": "2015-10-08 11:23:12",
    "points": 4,
    "officer": "Veruca Salt",
    "type": "community"
  },
  {
    "name": "The Television Room",
    "datetime": "2015-10-16 13:05:10",
    "points": 8,
    "officer": "Mike Teevee",
    "type": "wildcard"
  }
];
var attendances = [
  {
    "id": 1,
    "name": "The Chocolate Room",
    "datetime": "2015-10-01 10:30:00",
    "points": 1,
    "officer": "Augustus Gloop",
    "type": "social"
  },
  {
    "id": 2,
    "name": "Der Inventing Room",
    "datetime": "2015-10-01 10:50:00",
    "points": 5,
    "officer": "Violet Beauregarde",
    "type": "academic"
  },
  {
    "id": 3,
    "name": "The Egg Room",
    "datetime": "2015-10-08 11:23:12",
    "points": 4,
    "officer": "Bad Egg",
    "type": "community"
  },
  {
    "id": 4,
    "name": "The Television Room",
    "datetime": "2015-10-16 13:05:10",
    "points": 8,
    "officer": "Mike Teevee",
    "type": "academic"
  }
];

console.log('creating users...');
for (var person of people) {
  data.addUser(person, function(id) {});
}

console.log('creating events...');
for (var event of events) {
  data.addEvent(event, function(id) {});
}

console.log('adding users to events...');
setTimeout(function() {
  for (var attendance of attendances) {
    data.addUserToEvent(1, attendance, function() {});
    setTimeout(process.exit, 500);
  }
}, 200);

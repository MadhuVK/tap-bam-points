// run with `node demoData.js` to add some records to your tBp database

var data = require('../src/data.js');

var people = [
  {
    "firstName": "Antonio",
    "lastName": "Ngonye",
    "barcodeHash": "123",
    "house": "red",
    "memberStatus": "officer"
  },
  {
    "firstName": "Mel",
    "lastName": "D",
    "barcodeHash": "456",
    "house": "green",
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
    "memberStatus": "initiate"
  }
];
var events = [
  {
    "name": "The Chocolate Room",
    "datetime": "2015-10-01 10:30:00",
    "points": 1,
    "officer": "August Gloop",
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

for (var person of people) {
  data.addUser(person, function(id) {});
}

for (var event of events) {
  data.addEvent(event, function(id) { process.exit() });
}
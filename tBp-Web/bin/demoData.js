// run with `ode demoData.js` to add some records to your tBp database

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

for (var person of people) {
  data.addUser(person, function(id) {
    process.exit();
  });
}
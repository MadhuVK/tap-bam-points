exports.users = [
  { "firstName": "Antonio", "lastName": "Ngonye", "barcodeHash": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", "house": "red", "memberStatus": "initiate" },
  { "firstName": "Mel", "lastName": "D", "barcodeHash": "456", "house": "blue", "memberStatus": "initiate" },
  { "firstName": "Mad", "lastName": "Brown Dog", "barcodeHash": "789", "house": "red", "memberStatus": "member" },
  { "firstName": "Spencer", "lastName": "Beard", "barcodeHash": "090", "house": "green", "memberStatus": "officer" },
  { "firstName": "Sam", "lastName": "Wong", "barcodeHash": "666", "house": "green", "memberStatus": "officer" },
  { "firstName": "Satch", "lastName": "Boogie", "barcodeHash": "018", "house": "red", "memberStatus": "member" },
  { "firstName": "Donald", "lastName": "Kanooth", "barcodeHash": "111", "house": "red", "memberStatus": "initiate" },
  { "firstName": "Rish", "lastName": "l'Bish", "barcodeHash": "424", "house": "blue", "memberStatus": "initiate" },
];

exports.events = [
  { "name": "The Chocolate Room", "datetime": "2015-10-01 10:30:00", "points": 1, "officer": "Augustus Gloop", "type": "social", "wildcard": false },
  { "name": "Dodgeball", "datetime": "2015-11-19 23:30:00", "points": 2, "officer": "Augustus Gloop", "type": "social", "wildcard": false },
  { "name": "Jules Witch Burning", "datetime": "2015-10-31 23:59:00", "points": 5, "officer": "Magus Gee", "type": "community", "wildcard": true },
  { "name": "Study Party", "datetime": "2016-01-11 20:01:00", "points": 3, "officer": "RHsiao", "type": "academic", "wildcard": false },
  { "name": "River Cleanup", "datetime": "2016-02-14 07:30:00", "points": 2, "officer": "Henrietta", "type": "community", "wildcard": false },
  { "name": "Bent Polishing", "datetime": "2016-02-01 13:40:30", "points": 1, "officer": "Bronze Lady", "type": "social", "wildcard": true },
  { "name": "House Event: Ultimate Flying Disk", "datetime": "2016-02-02 13:39:00", "points": 1, "officer": "Sportz Guy", "type": "social", "wildcard": false },
];

exports.attendances = [
  { "id": 1, "pointsEarned": 1, "type": "social" },
  { "id": 2, "pointsEarned": 4, "type": "social" },
  { "id": 3, "pointsEarned": 5, "type": "community" },
  { "id": 4, "pointsEarned": 2, "type": "academic" },
  { "id": 5, "pointsEarned": 2, "type": "community" },
  { "id": 6, "pointsEarned": 1, "type": "social" },
  { "id": 7, "pointsEarned": 1, "type": "social" },
];

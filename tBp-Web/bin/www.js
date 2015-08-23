var app = require('../app.js');

var port = 3000;
var server = app.listen(port, function() {
  console.log("tBp listening on port %s", port);
});
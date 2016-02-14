var path = require('path'); 
var rootPath = path.normalize(__dirname + '/..'); 

module.exports = {
  development: {
    db_connection: {
      connectionLimit: 50, 
      host: "localhost", 
      user: "root", 
      password: "", 
      database: "tBp"
    }, 

    jwt_secret: "jubyjuby23",

    httpsPort: 443,
    httpPort: 80
  }, 

  test: {
    db_connection: {
      connectionLimit: 50, 
      host: "localhost", 
      user: "root", 
      password: "", 
      database: "tBp_test"
    }, 

    httpsPort: 5000,
    httpPort: 5001
  }, 

  production: {
    httpsPort: 443,
    httpPort: 80
  }

}

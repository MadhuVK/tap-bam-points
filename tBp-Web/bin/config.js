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

    port: 3000
  }, 

  test: {
    db_connection: {
      connectionLimit: 50, 
      host: "localhost", 
      user: "root", 
      password: "", 
      database: "tBp_test"
    }, 

    port: 5000
  }, 

  production: {
  }

}

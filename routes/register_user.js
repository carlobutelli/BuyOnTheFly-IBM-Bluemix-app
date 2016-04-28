var express = require('express');
var	path = require('path');
var Cloudant = require('cloudant');
var	bodyParser = require('body-parser');
var router = express.Router();

/**** DB Initialization ****/
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var credentials = services['cloudantNoSQLDB'][0]['credentials'];
var cloudDB = Cloudant({account:credentials.username, password:credentials.password}, 
  function(err, cloudant) {
      if (err) {
        return console.log('Failed to initialize Cloudant: ' + err.message);
      }
  });
var buyontheflyUsers = cloudDB.db.use('users');
/**** End DB Initialization ****/


router.post('/', function(req,res){
    
    var id = req.user['id'];
    var username = req.body.username;
    var email = req.body.email;
    var location = req.body.location;

    // Get all the documents in the DB users
    buyontheflyUsers.view("AllUsers","all-users",{'include_docs':true},function(err,data){ 
      if (!err) {
          var found = false;
              var i;
              for (i = 0; i < data.rows.length && !found; i++) {
                  var row = data.rows[i];
                  if( row.value.Username === username ){
                      found = true;
                      console.log("Username already taken: '" + row.value.Username + "' already taken");
                      res.rendirect('/registration');
                      break;
                  } else if ( row.value.Email === email ){
                      found = true;
                      console.log("This email: '" + row.value.Email + "' already exists");
                      res.redirect('/registration');
                      break;
                  }
              }
              // If the user does not exist, create it
              if(!found){
                  buyontheflyUsers.insert({"_id" : id, "username": username, "email": email, "location": location }, function(err, body) {
                      if (!err){
                        res.redirect("/profile");
                      } else {
                        console.log("Error in user registration.");
                      }
                  });
              }              
      } else {
          console.log("FAILED QUERY TO DB " + err);
      }
    });
});

module.exports = router;
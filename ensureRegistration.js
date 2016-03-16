var Cloudant = require('cloudant');

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

function getUser (req, res, next) {
	if(req.isAuthenticated()){
        if(typeof req.session.userIdentifier == 'undefined' ){ 
            buyontheflyUsers.view("AllUsers","all-users",{'include_docs':true},function(err,data){     
                if(!err){
                    var found = false;
                    var i;
                    for (i = 0; i < data.rows.length && !found; i++) {
                        var row = data.rows[i];
                        if(row.id === req.user['id']){
                            found = true;
                            break;
                        }
                    }
                
                    if(found){
                        req.session.userIdentifier = req.user['id'];
                        buyontheflyUsers.get(req.user['id'], { revs_info: true }, function(err, body) {
      						if (!err){
        						req.session.username = body.username;
        						req.session.email = body.email;
        						req.session.location = body.location;
        						next();
        					}
        					else{console.log("LOAD USER FAILED QUERY");}
    					});
                    } else {
                        res.redirect('/registration');
                    }
                } else {
                    console.log("FAILED QUERY TO DB " + err);
                }
            });
        } else{ 
            next();
        }
    } else {
        next();
    }
 }

module.exports.getUser = getUser;

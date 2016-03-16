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
var buyontheflyItems = cloudDB.db.use('items');
/**** End DB Initialization ****/

router.get('/', function(req, res, next) {

	buyontheflyItems.view("AllItems","all-items",{'include_docs':true},function(err,data){  
      if(!err){
          var i;
          var items = [];
          for (i = 0; i < data.rows.length; i++) {
              var row = data.rows[i];
              if( row.value.seller === req.session.username ){
                  items.push(row);
              }
          }
          var itemJSON = JSON.parse(JSON.stringify(items)); 
          res.json(itemJSON);
      }
  });
});

/* DELETE items  */
router.delete('/?', function(req, res, next) {
    console.log('Accessing delete section ...');
    var id= req.query.id;
    var rev =req.query.rev;
    console.log('user id : '+id);
    buyontheflyItems.destroy(id,rev,function(err,body){
        if(!err){
            res.render('profile');
        }
    });
});

module.exports = router;
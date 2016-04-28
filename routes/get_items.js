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

  var itemsToPublish = [];

  buyontheflyItems.view("AllItems","all-items",{'include_docs':true},function(err,data){  
      if(!err){
          var i;
          for (i = 0; i < data.rows.length; i++) {
              var row = data.rows[i];
              if(!row.value.buyer){
                  itemsToPublish.push(row);
              }
          } 
          console.log(data.rows);
          res.json(JSON.parse(JSON.stringify(itemsToPublish)));
      }
  });
  	/*res.json({ 
		name: name,
		price: price,
		city: city,
		img: file_data,
		description: description
    }); */ 
});

module.exports = router;

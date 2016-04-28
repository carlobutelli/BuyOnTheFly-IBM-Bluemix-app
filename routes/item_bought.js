var express = require('express');
var	path = require('path');
var Cloudant = require('cloudant');
var	bodyParser = require('body-parser');
var router = express.Router();

/**** DB Initialization ****/
/*var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var credentials = services['cloudantNoSQLDB'][0]['credentials'];
var cloudDB = Cloudant({account:credentials.username, password:credentials.password}, 
  function(err, cloudant) {
      if (err) {
        return console.log('Failed to initialize Cloudant: ' + err.message);
      }
  });
var buyontheflyItems = cloudDB.db.use('items');*/
/**** End DB Initialization ****/

router.get('/', function(req, res, next) {

    var name = req.query.name;
    var price = req.query.price;
    var seller = req.query.seller;
    var description = req.query.description;
    var city = req.query.city;
    var img_name = req.query.img_name;
    /*
  	res.json(
    { 
    		name: name,
        seller: seller,
    		price: price,
    		city: city,
    		img: img_name,
    		description: description
    }); */

    res.render('item_from_catalog',
    { 
        name: name,
        seller: seller,
        price: price,
        city: city,
        img: img_name,
        description: description
    }); 
});

module.exports = router;
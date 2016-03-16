var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
	var logged = true;
  	
  	if(!req.isAuthenticated()) {
		logged = false;
	}
	
	res.render('item_from_catalog', 
	{ 
		user: logged,
		usrName: req.session.username, 
		name: name,
        seller: seller,
		price: price,
		city: city,
		img: img_name,
		description: description
	});
});

module.exports = router;
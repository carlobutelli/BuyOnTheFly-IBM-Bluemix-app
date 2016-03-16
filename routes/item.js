var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
	var logged = true;
  	
  	if(!req.isAuthenticated()) {
		logged = false;
	}
	
	res.render('item', { 
		user: logged,
		usrName: req.session.username, 
		name: name,
		price: price,
		description: description
	});
});

module.exports = router;
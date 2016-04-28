var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
	var logged = true;
  	
  	if(!req.isAuthenticated()) {
		logged = false;
	}
	res.render('index', { 
		user: logged, 
		usrName: req.session.username,
		title: "BuyOnTheFly" 
	});
});

module.exports = router;
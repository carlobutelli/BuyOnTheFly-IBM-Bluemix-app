var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
	var logged = true;
  	
  	if(!req.isAuthenticated()) {
		logged = false;
	}
	res.render('delivery_boxes', { 
		user: logged, 
		usrName: req.session.username
	});
});

module.exports = router;
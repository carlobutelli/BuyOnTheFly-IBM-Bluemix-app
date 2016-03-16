var express = require('express');
var router = express.Router();

/* GET sell form page */
router.get('/', function(req, res, next) {
	var logged = true;
  
	if(!req.isAuthenticated()) {
		logged = false;
	}
	res.render('sell', {
		user: logged,
		usrName: req.session.username
    });
});


module.exports = router;
var express = require('express');
var router = express.Router();

router.get("/", function(req, res, next){
    var logged = true;
  
	if(!req.isAuthenticated()) {
		logged = false;
	}
	res.render('catalog', {
		user: logged,
		usrName: req.session.username
    });
});

module.exports = router;
var express = require('express');
var multer = require('multer');		//for multipart-data
var	fs = require('fs');					//file system		
var	mime = require('mime');				//content-type (image/jpeg)
var	bodyParser = require('body-parser');
var	path = require('path');
var Cloudant = require('cloudant');
var passport = require('passport');
var nodemailer = require('nodemailer');
var router = express.Router();

/*------------------SMTP Start-----------------------------*/
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
      XOAuth2: {
        user: "mailbuyonthefly@gmail.com", 
        clientId: "1075246027086-ppvch5js9vmlim0klihh97i43j38hmv2.apps.googleusercontent.com",
        clientSecret: "WUYb_EUn26ECKoEZhSVjz5t2",
        refreshToken: "1/T5OIpLDqaKTcOhYDpEQyE0vzaCnCSGB8Mrtdb6DR3PY"
      }
    }
});
/*------------------SMTP Over-----------------------------*/

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
var buyontheflyUsers = cloudDB.db.use('users');
/**** End DB Initialization ****/

router.post('/?', function(req,res){
    var id= req.query.id;
    var rev =req.query.rev;
    buyontheflyItems.get(id, function(err, doc) {
        /*Send email to seller*/
        var mailOptions={
                  from: "mailbuyonthefly@gmail.com",
                  to : doc.seller_email,
                subject : req.session.username,
                  type: 'Item bought',
                  text : "Hi "+doc.seller+",\n\nUser "+req.session.username+"\nmail:"+req.session.email+"\n\nhas\
                just bought one of your items: " + doc.name + ".\n\nCity: " + doc.city + ".\n\nLog in to http://buyonthefly-group4.mybluemix.net/profile\
                to manage the delivery to the buyer."
              }
        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
              res.end("error");
            }else{
              console.log("Message sent: " + response.message);
            }
        });
    });
});

module.exports = router;
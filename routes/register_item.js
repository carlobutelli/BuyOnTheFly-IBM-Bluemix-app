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
buyontheflyItems.update = function(obj, key, callback) {
  var db = this;
  db.get(key, function (error, existing) { 
    if(!error) obj._rev = existing._rev;
    db.insert(obj, key, callback);
  });
}
/**** End DB Initialization ****/

/** Saving the image ond the folder uploads **/
var pathImg = './public/img/gal/';
var mimeType;
var name, price, city, description, logged, picBody, file_data, dbURL, file_id;

var storage = multer.diskStorage({					//use storage of app
	  destination: function (req, file, callback) {		//destination folder for uploads
	    callback(null, pathImg);						//setting the folder for uploads
	  },
	  filename: function (req, file, callback) {		//handling filenames and extensions
	   	callback(null, Date.now() + '.jpg');// + mime.extension(file.mimetype)); //'img-' + Date.now() + '.png');		//setting encoding to base64 for attachments
	  	mimeType = 'image/jpeg';//+mime.extension(file.mimetype);	
	  }
});

router.post('/', multer({ storage: storage }).single('itemPhoto'), function(req,res){

	name = req.body.name;
	price = req.body.price;
	city = req.body.city;
	description = req.body.description;
	file_data = req.file.filename;
	var ins_body_rev;
	picBody;

	console.log("From file:");
	console.log(req.file); //form files

	/******* SAVE ITEM IN DB ******/ 
	var data = fs.readFileSync(pathImg+''+file_data);

	buyontheflyItems.insert({ 
					"userId": req.user['id'],
					"seller": req.session.username, 
					"seller_email": req.session.email,
					"name": name, 
					"price": price, 
					"city": city, 
					"description": description, 
					"img_name": file_data 
				}, function(err, insertBody) {
        			if (!err){
        				console.log("Item inserted:");
        				buyontheflyItems.attachment.insert(insertBody.id, file_data, data, mimeType, { rev: insertBody.rev }, function(err, body) {          
			        		if (!err){	
	  		            		console.log(insertBody);
			  		         	file_id = insertBody.id;  
	  		        		}
	    				}); 
        			} 
    });	 
	console.log("Utente: " + req.session.username);
	//console.log(mailOptions);

	/******** SEND EMAIL TO ALL THE USERS ********/
	buyontheflyUsers.view("AllUsers","all-users",{'include_docs':true},function(err,data){ 
      	if (!err) {
      		var i;
          	for (i = 0; i < data.rows.length; i++) {
            	var row = data.rows[i];
              	if( row.value.Location === city ){
                  	//console.log("Location " + i + ": " + row.value.Location + "email: " + row.value.Email);
                  	var mailOptions={
				    	from: "mailbuyonthefly@gmail.com",
				     	to : row.value.Email,
						subject : req.session.username,
			    		type: 'Item for Sale',
			 			description: description,
				   		text : "Hi "+row.value.Username+",\n\nUser "+req.session.username+"\nmail:"+req.session.email+"\n\nis\
						selling a new item: " + name + ".\n\nPrice: " + price + "\n\nCity: " + city + ".\n\n" + "Description:\n\n" + description + ".\
				   		\nLog in to http://buyonthefly-group4.mybluemix.net and find out which other products are being sold."
					}
					smtpTransport.sendMail(mailOptions, function(error, response){
						if(error){
					    	console.log(error);
					    	res.end("error");
					    }else{
					    	console.log("Message sent: " + response.message);
					    }
					});
              	}	 
          	}
      	}
  	});

	logged = true;
  
	if(!req.isAuthenticated()) {
		logged = false;
	}
	res.render('item', {
		user: logged,
		usrName: req.session.username,
		seller: req.session.username,
		name: name,
		price: price,
		city: city,
		img: file_data,
		description: description
    });
});

router.get('/', function(req, res, next) {
  	res.json({ 
		name: name,
		usrName: req.session.username,
		seller: req.session.username,
		price: price,
		city: city,
		img: file_data,
		description: description
    });  
});

/* PUT items  */
router.put('/?', function(req, res, next) {
    var id= req.query.id;
    var rev =req.query.rev;
	
	buyontheflyItems.get(id, function(err, doc) {
		console.log(doc);

		buyontheflyItems.insert({ 
				"_id": id, 
				"_rev": rev, 
				"buyer": req.session.username,
				"emailBuyer": req.session.email,
				"userId": doc.userId,
				"seller": doc.seller,
				"seller_email": doc.seller_email,
				"buyer": req.session.username,
				"name": doc.name,
				"price": doc.price,
				"city": doc.city,
				"description": doc.description,
				"img_name": doc.img_name,
				"_attachments": doc._attachments 
		}, function(err, response) {
			if (err) {
				console.log("error " + err);
				res.redirect('/');
			} else {
				console.log("Success");

				/*Send email to seller*/
		        var mailOptions={
		                  from: "mailbuyonthefly@gmail.com",
		                  to : doc.seller_email,
		                subject : req.session.username,
		                  type: 'Item bought',
		                  text : "Hi "+doc.seller+",\n\nUser "+req.session.username+"\nmail:"+req.session.email+"\n\nhas just bought one of your items: " + doc.name + ".\n\nCity: " + doc.city + ".\n\nLog in to http://buyonthefly-group4.mybluemix.net/profile to manage the delivery to the buyer."
		              }
		        smtpTransport.sendMail(mailOptions, function(error, response){
		          if(error){
		              console.log(error);
		              res.end("error");
		            }else{
		              console.log("Message sent: " + response.message);
		            }
		        });

				res.redirect('catalog');
				/*res.render('profile',
					{	
						name: doc.name,
						price: doc.price,
						seller: doc.seller,
						description: doc.description,
						city: doc.city,
						img_name: doc.img_name

					});*/
			}
		});
	});

 });	



module.exports = router;
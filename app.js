var express = require('express');
var cfenv = require('cfenv');
var path = require('path');
var nodemailer = require('nodemailer');
var multer = require('multer');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var Cloudant = require('cloudant');
var ensureRegistration = require('./ensureRegistration');

var routes = require('./routes/index');
var sell = require('./routes/sell'); 
var catalog = require('./routes/catalog');
var registration = require('./routes/registration'); 
var item = require('./routes/item');
var register_item = require('./routes/register_item');
var register_user = require('./routes/register_user');
var get_items = require('./routes/get_items');
//var item_from_catalog = require('./routes/item_from_catalog');
var profile = require('./routes/profile');
var user_items = require('./routes/user_items');
var item_from_catalog = require('./routes/item_from_catalog');
var item_bought = require('./routes/item_bought');
var delivery_boxes = require('./routes/delivery_boxes');
var settings = require('./config/settings');

// VCAP_SERVICES contains all the credentials of services bound to this application. 
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

/* CLOUDANT DATABASE INIT */
var credentials = services['cloudantNoSQLDB'][0]['credentials'];
var cloudDB = Cloudant({account:credentials.username, password:credentials.password}, 
  function(err, cloudant) {
      if (err) {
        return console.log('Failed to initialize Cloudant: ' + err.message);
      }
  });
var buyontheflyUsers = cloudDB.db.use('users');
var buyontheflyItems = cloudDB.db.use('items');

// Test DB
cloudDB.db.list(function(err, allDbs){
  console.log('All my databases: %s', allDbs.join(', ')); 
});
/* END CLOUDANT DATABASE INIT */

var app = express();

app.use(session({ secret: 'keyboard cat' }));
app.use(bodyParser.json());         
app.use(bodyParser.urlencoded({ extended: true }));

var sess;

/*------------------SMTP Start-----------------------------*/
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
      XOAuth2: {
        user: "mailbuyonthefly@gmail.com", 
        clientId: "******",
        clientSecret: "*******",
        refreshToken: "********"
      }
    }
});
/*------------------SMTP Over-----------------------------*/

//all templates are located in `/views` directory
app.set('views', path.join(__dirname, "views"));
//using `ejs` template engine with default extension `ejs`
app.set('view engine', 'ejs');
//use the /public directory where you store images, stylesheets and scripts
app.use(express.static(path.join(__dirname, 'public')));

/******* SINGLE SIGN ON INIT ******/
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session()); 

passport.serializeUser(function(user, done) {
   done(null, user);
}); 

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});  

var ssoConfig = services.SingleSignOn[0]; 
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
var callback_url = 'http://buyonthefly-group4.mybluemix.net/auth/sso/callback';

var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
                 authorizationURL : authorization_url,
                 tokenURL : token_url,
                 clientID : client_id,
                 scope: 'openid',
                 response_type: 'code',
                 clientSecret : client_secret,
                 callbackURL : callback_url,
                 skipUserProfile: true,
                 issuer: issuer_id
                 }, function (iss, sub, profile, accessToken, refreshToken, params, done){
                        process.nextTick(function (){
                            profile.accessToken = accessToken;
                            profile.refreshToken = refreshToken;
                            done(null, profile);
                        })
                    }
                ); 

passport.use(Strategy); 
app.get('/login', passport.authenticate('openidconnect', {})); 
          
function ensureAuthenticated(req, res, next) {
    if(!req.isAuthenticated()) {
        req.session.originalUrl = req.originalUrl;
        res.redirect('/login');
    } else {
        return next();
    }
}

//SECURITY: SSO redirect after login
app.get('/auth/sso/callback',function(req,res,next) {
    var redirect_url = req.session.originalUrl;
    passport.authenticate('openidconnect',{
        successRedirect: redirect_url,                            
        failureRedirect: '/failure'                        
    })(req,res,next);
});

app.get('/logout', function(req, res){
    //req.logout();
    //res.redirect('/');
    req.session.destroy(function(err){
      if(err){
          console.log(err);
      } else {
          res.redirect('/');
      }
    });
});

app.get('/failure', function(req, res) {
    res.send('Login failed');
});
/****** SINGLE SIGN ON INIT END *******/

app.get("/credentials", function(request, response) {
    response.send(settings);
});

app.use('/', routes);
app.use('/index', routes);

app.use('/catalog', ensureAuthenticated);
app.use('/catalog', ensureRegistration.getUser)
app.use('/catalog', catalog);

app.use('/sell', ensureAuthenticated);
app.use('/sell', ensureRegistration.getUser);
app.use('/sell', sell);

app.use('/registration', ensureAuthenticated);
app.use('/registration', registration);

app.use('/item', ensureAuthenticated);
app.use('/item', ensureRegistration.getUser);
app.use('/item', item);

app.use('/register_item', register_item);
app.use('/register_user', register_user);
app.use('/user_items', user_items);
app.use('/get_items', get_items);
app.use('/item_bought', item_bought);

app.use('/profile', ensureAuthenticated);
app.use('/profile', ensureRegistration.getUser);
app.use('/profile', profile);

app.use('/item_from_catalog', ensureAuthenticated);
app.use('/item_from_catalog', ensureRegistration.getUser);
app.use('/item_from_catalog', item_from_catalog);

app.use('/delivery_boxes', ensureAuthenticated);
app.use('/delivery_boxes', ensureRegistration.getUser);
app.use('/delivery_boxes', delivery_boxes);

/*------------------Routing mail help Started ------------------------*/
app.get('/send',function(req,res){
  var mailOptions={
    from: "mailbuyonthefly@gmail.com",
      to : "mailbuyonthefly@gmail.com",
      subject : req.query.subject,
      type: req.query.type,
    text : "From: " + req.query.subject + " <" +req.query.sender + ">\n\nType of the request: " + 
    req.query.type + "\n\n" + req.query.text + ""
  }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
      res.end("error");
    }else{
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});
/*------------------Routing mail help Over ------------------------*/

/**** Error handlers ****/ 
if (app.get('env') === 'development') {  
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {  
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, appEnv.bind, function() {

  console.log("Server starting on ", appEnv.url)
});

module.exports = app;
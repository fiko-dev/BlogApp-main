require('dotenv').config();
const express = require('express');
const config = require('./config/config');
const compression = require ('compression');
const helmet = require('helmet');
//const http= require("http"); //modified from "HTTPS"
const https= require("https");
const fs = require('fs')




const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');


const User = require("./models/user");

const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');


const app = express();

app.set('view engine', 'ejs');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());
app.use(mongoSanitize());
app.use(express.static('public'));

  
app.set('trust proxy', 1); // trust first proxy

const port = config.get('port') || 3000;
const blogDB = config.get('db.name')

const blog_db_url = `mongodb+srv://fikofoxx:Password1@cluster0.hhuyhz5.mongodb.net/?retryWrites=true&w=majority`;
/*const blog_db_url2 =

	config.get('db.db_url') +
	config.get('db.password') +
	config.get('db.host') +
	blogDB +
	'?retryWrites=true&w=majority';

console.log(blog_db_url2);
console.log(config.get(`db.db_url`));
console.log(config.get(`db.password`));
console.log(config.get(`db.host`));
console.log(blogDB);
*/
console.log(blog_db_url);	

//connect to MongoDB database
const dbConnection = mongoose.connect(blog_db_url, (err) => {
  if(err){
    console.log(err)
  }
});

app.use(
	session({
		secret: config.get('secret'),
		resave: false,
    store: MongoStore.create({
      mongoUrl: blog_db_url,
      ttl: 2 * 24 * 60 * 60
    }),
		saveUninitialized: false,
		cookie: { secure: 'auto' }
	})
);



app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

app.use(function(req, res, next) {
	res.locals.isAuthenticated=req.isAuthenticated();
	next();
});

app.use('/user', userRouter);

app.use('/post', postRouter);

app.all('*', function(req, res) {
  res.redirect("/post/about");
});

/* Original code
app.listen(port,() => {
console.log('Listening ...Server started on port ' + port);
})
*/

/* Tarek's fix
const server = http.createServer(app.listen(port,() => { 
console.log('Listening ...Server started on port ' + port);
}))
*/

const options = {
	key: fs.readFileSync('./private-key.pem'),
	cert: fs.readFileSync('./certificate.pem')
  };
const server = https.createServer(options,app);

server.listen(port, () => {
	console.log(`Server running on port ` + port);
  });


module.exports = app;

var express        =  require('express'),
    app            =  express(),
    bodyParser     =  require('body-parser'),
    mongoose   	   =  require('mongoose'),
	passport   	   =  require('passport'),
	LocalStrategy  =  require('passport-local'),
	methodOverride =  require('method-override'),
	flash		   =  require('connect-flash'),
	Campground     =  require('./models/campground'),
	Comment        =  require('./models/comment'),
	User           =  require('./models/user'),
	seedDB 	       =  require('./seeds')

// requiring routes 
var commentRoutes    = require('./routes/comments'),
 	campgroundRoutes = require('./routes/campgrounds'),
	indexRoutes      = require('./routes/index')

var PORT = process.env.PORT || 3000
var url = process.env.DATABASEURL || 'mongodb://localhost:27017/yelp_camp_v12'
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //every time we restart the server campgrounds will be deleted

// PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Howlin around my happy home',
	resave: false, 
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user; // applies user on every route
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(PORT, function(req, res){
	console.log('Server has started!');
});
var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware/index');

// INDEX - show all campgrounds
router.get('/', function(req, res){
	// get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else {
			res.render('campgrounds/index', {campgrounds:allCampgrounds});
		}
	});
});

// NEW - show form to create new campgrounds
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new');
});

// CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, image:image, price: price, description: desc, author: author};
	console.log(req.user);
	// Create a new campgorund and save it to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else {
			// Redirect back to campgorunds page
			console.log(newlyCreated);
			res.redirect('/campgrounds');
		}
	});
});

// SHOW - show info abou specific campground
router.get('/:id', function(req, res){
	// Find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', 'Campground not found');
			res.redirect('back');
		}else {
			console.log(foundCampground);
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE 
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});
	

// UPDATE ROUTE 
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground  
	var data = {name: req.body.name, image: req.body.image};
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect('/campgrounds');
		}else{
			res.redirect('/campgrounds/' + req.params.id)
		}
	});
});

// DESTROY CAMPGROUND ROUTE 
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/campgrounds');
		}else{
			res.redirect('/campgrounds');
		}
	});
});

module.exports = router; 

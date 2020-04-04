const express = require("express"),
	  router = express.Router(),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", (req, res) => {
	//get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	var newCampground = {
		name: req.body.name,
		price: req.body.price,
		image: req.body.image,
		description: req.body.description,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	};
	Campground.create(newCampground, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Newly created campground: ")
			console.log(campground);
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

//SHOW - show more info about one campground
router.get("/:id", (req, res) => {
	//find the campground with the provided provided
	//render show template with that campground
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			// console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if (err) {
			res.redirect(`/campgrounds`);
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, foundCampground) => {
		if (err) console.log(err);
		Comment.deleteMany({_id: {$in: foundCampground.comments}}, err => {
			if (err) console.log(err);
			res.redirect("/campgrounds");
		});
	});
});

module.exports = router;
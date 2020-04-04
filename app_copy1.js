const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment"),
	  User = require("./models/user"),
	  seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

//passport configuration
app.use(require("express-session")({
	secret: "yelp114514",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.get("/", (req, res) => {
	res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", (req, res) => {
	var newCampground = {name: req.body.name, image: req.body.image, description: req.body.description};
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
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

//SHOW - show more info about one campground
app.get("/campgrounds/:id", (req, res) => {
	//find the campground with the provided provided
	//render show template with that campground
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});

// =================
// COMMENTS ROUTES
// =================

//NEW - show form to create new comment
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			return;
		}
		res.render("comments/new", {campground: campground});
	});
});
//CREATE - add new comment to DB
app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		}
		Comment.create(req.body.comment, (err, comment) => {
			if (err) {
				console.log(err);
				return;
			}
			campground.comments.push(comment);
			campground.save();
			res.redirect("/campgrounds/" + campground._id);
		});
	});
});

// =================
// Auth routes
// =================

//show register form
app.get("/register", (req, res) => {
	res.render("register");
});
//handle sign up logic
app.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			res.render("/resigter");
			return;
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/campgrounds");
		});
	});
});

//show login form
app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}));

//logic route
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

app.listen(3000, _ => {
	console.log("YelpCamp server started");
});
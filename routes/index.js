const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user");

//root route
router.get("/", (req, res) => {
	res.render("landing");
});

//show register form
router.get("/register", (req, res) => {
	res.render("register");
});
//handle sign up logic
router.post("/register", (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to CampingShare " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", (req, res) => {
	res.render("login");
});

//handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: true
}));

//logic route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;

const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  Campground = require("../models/campground"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");

//NEW - show form to create new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			return;
		}
		res.render("comments/new", {campground: campground});
	});
});

//CREATE - add new comment to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		}
		Comment.create(req.body.comment, (err, comment) => {
			if (err) {
				req.flash("error", "Something went wrong");
				return console.log(err);
			}
			comment.author.id = req.user._id;
			comment.author.username = req.user.username;
			comment.save();
			campground.comments.push(comment);
			campground.save();
			req.flash("success", "Successfully added comment");
			res.redirect("/campgrounds/" + campground._id);
		});
	});
});

//no SHOW route for comment

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndDelete(req.params.comment_id, (err) => {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect(`/campgrounds/${req.params.id}`);
		}
	});
});

module.exports = router;
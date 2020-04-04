const app = require("express")(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// var campgrounds = [
// 	{name: "Salmon Creek", image: "https://www.outtherecolorado.com/wp-content/uploads/2017/03/23caa67e99c75c84468d07f6aa80027b.jpg"},
// 	{name: "Granite Hill", image: "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2017/08/GJOverlandChairBryonDorr-2.jpg"},
// 	{name: "Mountain Goat's Rest", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"},
// 	{name: "Salmon Creek", image: "https://www.outtherecolorado.com/wp-content/uploads/2017/03/23caa67e99c75c84468d07f6aa80027b.jpg"},
// 	{name: "Granite Hill", image: "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2017/08/GJOverlandChairBryonDorr-2.jpg"},
// 	{name: "Mountain Goat's Rest", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"},
// 	{name: "Salmon Creek", image: "https://www.outtherecolorado.com/wp-content/uploads/2017/03/23caa67e99c75c84468d07f6aa80027b.jpg"},
// 	{name: "Granite Hill", image: "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2017/08/GJOverlandChairBryonDorr-2.jpg"},
// 	{name: "Mountain Goat's Rest", image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg"}
// ];

// campgrounds.forEach(campground => {
// 	Campground.create(
// 		campground, (err, campground) => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("Newly created campground: ")
// 				console.log(campground);
// 			}
// 		});
// });

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/campgrounds", (req, res) => {
	//get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", (req, res) => {
	var name = req.body.name,
		image = req.body.image,
		newCampground = {name: name, image: image};
	Campground.create(
		newCampground, (err, campground) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Newly created campground: ")
				console.log(campground);
				res.redirect("/campgrounds");
			}
		});
});

app.get("/campgrounds/new", (req, res) => {
	res.render("new");
});

app.listen(3000, _ => {
	console.log("YelpCamp server started");
});
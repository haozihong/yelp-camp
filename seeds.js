var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2017/08/GJOverlandChairBryonDorr-2.jpg",
		description: "More specifically, this article is for web administrators, server developers, and front-end developers. Modern browsers handle the client side of cross-origin sharing, including headers and policy enforcement. But the CORS standard means servers have to handle new request and response headers. Another article for server developers discussing cross-origin sharing from a server perspective (with PHP code snippets) is supplementary reading."
	},
	{
		name: "Desert Mesa",
		image: "https://www.outtherecolorado.com/wp-content/uploads/2017/03/23caa67e99c75c84468d07f6aa80027b.jpg",
		description: "More specifically, this article is for web administrators, server developers, and front-end developers. Modern browsers handle the client side of cross-origin sharing, including headers and policy enforcement. But the CORS standard means servers have to handle new request and response headers. Another article for server developers discussing cross-origin sharing from a server perspective (with PHP code snippets) is supplementary reading."
	},
	{
		name: "Canyon Floor",
		image: "https://inteng-storage.s3.amazonaws.com/img/iea/MRw4y5ABO1/sizes/camping-tech-trends_resize_md.jpg",
		description: "More specifically, this article is for web administrators, server developers, and front-end developers. Modern browsers handle the client side of cross-origin sharing, including headers and policy enforcement. But the CORS standard means servers have to handle new request and response headers. Another article for server developers discussing cross-origin sharing from a server perspective (with PHP code snippets) is supplementary reading."
	},
	{
		name: "Granite Hill",
		image: "https://www.nps.gov/mora/planyourvisit/images/OhanaCampground2016_CMeleedy_01_web.jpeg",
		description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
	}
]

function seedDB() {
	//Remove all campgrounds
	Campground.deleteMany({}, (err) => {
		if (err) return console.log(err);
		console.log("removed campgrounds!");
		Comment.deleteMany({}, (err) => {
			if (err) return console.log(err);
			//add a few campgrounds
			data.forEach(seed => {
				Campground.create(seed, (err, campground) => {
					if (err) {
						console.log(err);
						return;
					}
					console.log("added a campground");
					//create comments
					Comment.create({
						text: "This place is great, but I wish there was internet.",
						author: "Homer"
					}, (err, comment) => {
						if (err) {
							console.log(err);
							return;
						}
						campground.comments.push(comment);
						campground.save();
						console.log("created new comment");
					});
				});
			});
		});
	});
}

module.exports = seedDB;
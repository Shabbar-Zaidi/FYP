// MVC: Controller
// This file contains all the logic for the routes in the listings.js file in the routes folder.

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};

// New Route:
module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render("./listings/new.ejs");
};

// Show Route:
module.exports.showListing = async (req, res) => {
  const { id } = req.params; // params is an object containing properties mapped to the named route “parameters”. For example, if you have the route /user/:name, then the “name” property is available as req.params.name. This object defaults to {}.
  const listing = await Listing.findById(id)
    // populate is used to get all reviews, owner of a listing
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    }) // Nested Populate
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  // console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  // const { title, description, price, image, location, country } = req.body;
  // if(!req.body.listing){    // You can also Write "if" for all fields but i can use validateListing(Joi)
  //   throw new ExpressError(400, "Send valid data for listing")
  // }
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "+++" ,filename);

  const newListing = new Listing(req.body.listing); // Same as above line
  // console.log(req.user);
  newListing.owner = req.user._id; // Adding current user (owner) to listing
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");
};

// Edit Route:
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;   // For preview of image in edit form but in low quality
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

// Update Route:
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (typeof req.file !== "undefined") {  // typeof is used to check whether req.file is undefined or not. if it is undefined then it will not execute the code inside if block means it will not update the image
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Successfully, Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// Delete Route:
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Successfully, Listing Deleted!");
  res.redirect("/listings");
};

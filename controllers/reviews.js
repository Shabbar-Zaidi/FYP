const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// POST Review route:
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // Adding author to review
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Successfully, New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

// Delete Review route:
module.exports.deleteReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully, Review Deleted!");
  res.redirect(`/listings/${id}`);
};

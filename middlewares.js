const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
// Model

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path,"++++++", req.originalUrl);
  if (!req.isAuthenticated()) {   // req.isAuthenticated() is a function provided by passport. It is used to check whether user is logged in or not
    // Redirect URL
    req.session.redirectUrl = req.originalUrl
    req.flash("error", "You must be signed in to create a new listing!");
    return res.redirect("/login");
  }
  next();
}; // This middleware is used to check whether user is logged in or not. If user is not logged in then it will show error message and redirect to login page

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    // console.log("Redirect URL", res.locals.redirectUrl);
    // console.log("req.session.redirectUrl", req.session.rediremoctUrl);
    res.locals.redirectUrl = req.session.redirectUrl; // locals variable is used to pass data to views. It is available to all routes not removed by passport
  }
  next();
} // This middleware is used to save redirect URL in locals so that it can be used in other routes because req.session.redirectUrl is reset due to passport session(remove it), so we are saving it in locals

// For Authorization: Editing and Deleting Listings
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {  // Checking if the user is the owner of the listing, Authorization
    req.flash("error", "You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}


// For Validating Listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
// For Validating Reviews:
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {  // Checking if the user is the owner of the listing, Authorization
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
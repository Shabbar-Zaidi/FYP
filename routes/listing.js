const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middlewares.js");

const multer = require("multer");    // Multer is used to upload files
const { storage } = require("../cloudConfig.js");  // Cloudinary storage is used to store images in cloudinary
const upload = multer({ storage });  // Stored in cloudinary

// const upload = multer({ dest: "uploads/" });  // dest is used to specify the destination where the files will be uploaded. In this case, it is uploads folder in the root directory of the application. Note: This is stored in local storage not in cloudinary

// Controllers:
const listingController = require("../controllers/listings.js");

// Router.route:
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
  // .post(upload.single("listing[image]"), (req, res) => {   // upload.single("listing[image]") is a middleware that is used to upload a single file
  //   // console.log(req.file);
  //   res.send(req.file);
  // });

// New route: New.ejs
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .get(wrapAsync(listingController.showListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit route:
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


// Same as above but with router.route():
// // Index route: Index.ejs  // Define in router.route("/")
// router.get("/", wrapAsync(listingController.index));

// // Create(New) route: New.ejs
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// // Show route:  Show.ejs   // Define in router.route("/:id")
// router.get("/:id", wrapAsync(listingController.showListing));

// // Create route:
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

// // Edit route:
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.renderEditForm)
// );

// // Update route:   // Define in router.route("/:id")
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// // Delete route:
// router.delete("/:id/", isOwner, isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;

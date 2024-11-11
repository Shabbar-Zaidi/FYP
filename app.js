// npm init -y
// npm i express ejs mongoose nodemon ejs-mate joi express-session connect-flash passport passport-local passport-local-mongoose multer dotenv cloudinary multer-storage-cloudinary connect-mongo
// Libraries:
// require("dotenv").config();  // dotenv is used to read .env file and set environment variables. It is used in development phase not in production phase. becaues it has our credentials
// console.log(process.env.SECRET);

if (process.env.NODE_ENV != "production") {  // If our environment is not production then we will use .env file to store sensitive information like API keys, database
  require("dotenv").config();
}


const express = require("express");
const app = express();    // Creates an instance of an Express application.
const path = require("path"); // Imports the path module for handling file paths.
const mongoose = require("mongoose");
const methodOverride = require("method-override");  // Imports the method-override middleware to support HTTP verbs like PUT and DELETE.
const ejsMate = require("ejs-mate"); // For using layout in ejs same include/partials
const session = require("express-session");  // Express-session is used to keep track of user's login status but it is not used for production. It is used for development phase. For production, we use connect-mongo session store
const MongoStore = require("connect-mongo");  // Connect-mongo is used to store session in MongoDB
const flash = require("connect-flash");   // for flash messages
const passport = require("passport");   // Passport is used for authentication
const LocalStrategy = require("passport-local");    // LocalStrategy is used to authenticate user



const ExpressError = require("./utils/ExpressError.js");  // Custom Error Class
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";  // Database URL connect with local mongodb
const MONGO_URL = process.env.ATLASDB_URL;  // Database URL connect with MongoDB Atlas



// Models require:
const User = require("./models/user.js");


// Routes require:
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine", "ejs");  // Sets the view engine to EJS
app.set("views", path.join(__dirname, "views"));  // Sets the views directory to the views folder in the root directory of the application. __dirname is the directory where the currently executing script resides. views is the folder where all the ejs files are stored.

// Middlewares:
app.use(express.urlencoded({ extended: true }));  // Middleware to parse incoming requests with urlencoded payloads
app.use(methodOverride("_method"));   // Middleware to support HTTP verbs like PUT and DELETE
app.engine("ejs", ejsMate);   // Sets EJS as the template engine
app.use(express.static(path.join(__dirname, "/public"))); 	// Static files like CSS, JS, images etc. are stored in public folder. This middleware serves static files from the specified directory. Static means that the files are not processed by the server. They are directly sent to the client as they are.

async function main() {  // Connects to MongoDB and handles connection success or failure.
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Something went wrong", err);
  });

  // connect-mongo is used to store session in MongoDB:
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {   // crypto is used to encrypt session data
    // secret: "mysupersecretcode",  // Same as sessionOptions secret
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,  // (in seconds) time period in seconds same as 1 day. It is used to update session after 1 day. If user is active then session will not expire
});


store.on("error", function (e) {
  console.log("Session Store Error", e);
});

const sessionOptions = {    // Default session expiry date is 14 days in connect-mongodb 
  store,  // same as you can write => (store: store) is used to store session in MongoDB
  // secret: "mysupersecretcode",  // A string used to sign the session ID cookie, ensuring the integrity and security of the session.
  secret: process.env.SECRET,
  resave: false,    // Forces the session to be saved back to the session store, even if it was never modified during the request. Setting it to false is a recommended option.
  saveUninitialized: true,  // A session is uninitialized when it is new but not modified. Setting it to true is useful for implementing login sessions
  cookie: {
    expires: Date.now() + 7 * 24 * 64 * 64 * 1000,   // Data.now() gives current time in milliseconds. 7 * 24 * 64 * 64 * 1000 which shows 7 days in milliseconds. So, cookie will expire in 7 days. Same as Github login account. Cookie will save in browser
    maxAge: 7 * 24 * 64 * 64 * 1000,
    httpOnly: true,    // Cookie will only be accessed by http request not by javascript/ Cross Site Scripting(XSS)
  },
};
app.use(session(sessionOptions));    // If cookie shows up in browser then session is working

// Flash Middleware:
app.use(flash());   // Flash is used to show message to user. It is used to show message to user after some action like after login, after logout, after adding new listing etc. Note: Flash is defined after our listing routes defined in app.use("/listings", listings) and app.use("/listings/:id/reviews", reviews)


// Passport Configuration
app.use(passport.initialize());   // A middleware to initialize passport
app.use(passport.session());    // A middleware to use passport session. It is used to keep track of user's login status. 
passport.use(new LocalStrategy(User.authenticate()));   // LocalStrategy is used to authenticate user. User.authenticate() is a method provided by passport-local-mongoose
passport.serializeUser(User.serializeUser());   // serializeUser: Converts the user object to an identifier (e.g., user ID) to store in the session.
passport.deserializeUser(User.deserializeUser());   // deserializeUser: Converts the identifier stored in the session back to the full user object on subsequent requests.


// Middleware to show flash messages to user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");  // res.locals is an object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request/response cycle (if any).
  // console.log("Success", res.locals.success);
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;   // req.user is set by passport. It is used to check whether user is logged in or not
  next(); // next() is used to pass control to the next middleware function in the stack. In this case, it is used to pass control to the next route handler which is app.use("/listings", listingsRouter)
});


// app.get("/demoUser", async (req, res) => {
//   const fakeUser = new User({ email: "shabbar1@gmail.com", username: "shabbar1" });     // Password is not saved in database. It is hashed and saved in database. PbKdf2 algroithm(in passport by default) is used to hash password 

//   const newUser = await User.register(fakeUser, "password");
//   res.send(newUser);
// });

// Routes:
app.use("/listings", listingsRouter);   // This is defined after app.use(flash()) because flash is used to show message to user
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// app.get("/testlistings", async (req, res) => {
//   const sampleListing = new Listing({
//     title: "My new Villa",
//     description: "This is a beautiful villa",
//     price: 200000,
//     location: "Mumbai",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("Listing saved");
//   res.send("Listing saved");
// });



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Error Handling Middleware:
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message)
});


// app.get("/", (req, res) => {
//   res.send("Hi I am root route");
// });

app.listen(8080, () => {
  console.log(`Server is running on port 8080`);
});

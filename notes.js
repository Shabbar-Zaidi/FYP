// router.route is used to chain multiple routes together. It is used to reduce redundancy in code. It is used to define multiple routes for a single route path.
// Image upload problem:
// 1. Can't Send files bcz our form is not capable 
// 2. BSON data form stored in mongoDb and BSON's size limit is not capable to store files like images

// To resolve:
// 1. Capable form to send files
// 2. Store files in cloud storage like AWS S3, Google Cloud Storage, etc. But it is costly so we use 3rd party services like Cloudinary, Firebase, etc.
// 3. Store files in server and store the path in the database

// .env file is used to store sensitive information like API keys, database URL, etc format: KEY=VALUE


// Mongo Atlas:
// 1. Go to MongoDB Atlas
// 2. Create a new cluster
// 3. Create a new database
// 4. Create a new user
// 5. Whitelist your IP address     // Allow access from anywhere

// "engines": {
//     "node": "20.17.0"
//   },
// engines defined in package.json due to render.com server, it uses node version 20.17.0



// In render.com:
// npm install  // for builtin command
// node app.js  // for start command
// Auto-Deploy: Select No
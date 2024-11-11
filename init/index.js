/**
 * We have created this `/init` folder to initialise database with fresh data.
 * so, we can perform project setup and data initialisation in this file.
 */

const mongoose = require("mongoose");
const initData = require("./data.js"); // Importing data from data.js file.
const Listing = require("../models/listing.js"); // Importing Listing model from models folder.

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

/* Database connectivity setup */
main()
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({  // Mapping the data and adding owner field to it. We can also add one by one in data.js but it will take time. So directly adding here.
    ...obj,    // ...obj is used to copy all the properties of obj to this object.
    owner: "672f636f40e90105a95aeca4",  // Adding owner field to each object in data.
  }));
  await Listing.insertMany(initData.data);
  console.log("Data is initialized.");
};

initDB();

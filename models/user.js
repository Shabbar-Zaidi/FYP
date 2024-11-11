const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
// Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value. We cannot add these fields manually because they are added by the plugin.

const userSchema = new Schema({   // username and password are added by passport-local-mongoose
  email: {
    type: String,
    required: true,
  }
});

userSchema.plugin(passportLocalMongoose); // plugin: This plugin adds the necessary fields and methods for handling username and password authentication

module.exports = mongoose.model("User", userSchema);

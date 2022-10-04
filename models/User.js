const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;  // ok we've assigned a const user as 'this' keyword
  if (!user.isModified("password")) {   // if not-this.methy("password")
    return next();                      // pop out w/next !!!
  }
  bcrypt.genSalt(10, (err, salt) => {    
    if (err) {
      return next(err);    // if err pop out w/next(err)  !!!
    }
    bcrypt.hash(user.password, salt, (err, hash) => {   
      // user.password aka progentitor's this.password from the UserSchema [to be] Users collection in db
      if (err) {return next(err)}
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword,cb){
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
   cb(err, isMatch)});
};

module.exports = mongoose.model("User", UserSchema);

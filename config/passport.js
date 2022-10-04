const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

// anon funky,  incoming parmy
module.exports = function (passport) {

  // parmy.use
  //app can be replaced with routerOrWhateva ?   in a dedicated file, 
  // "that's app baby!" (or whateva)
  // Methods passed into app.use()r MW

  // so above is 'a function' that is throwing in 'pport', 
  //  then pport.use(*** methy***) // new Constructor({k:v},(p1,p2,done)=>{...}) 
  
  // module.exports=funky(pport){"that's pport!"}
  passport.use(
    // destructuring k:v  usernameField: "email", first parmy
    // then arrow funky w/3 parmys
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {

      //  check db for email,   *** gonna need to talk to DB ***
      // const User = require("../models/User"); // models "i talk to db's!"
      // email is input field in req.body  normalize input email data first 
      // then arrow funky w/2 parmys
      User.findOne({ email: email.toLowerCase() }, (err, user) => {
        
        if (err) {
          return done(err);
        }
        
        if (!user) {
          return done(null, false, { msg: `Email ${email} not found.` });
        }
        
        if (!user.password) {
          return done(null, false, {
            msg:
              "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
          });
        }

        user.comparePassword(password, (err, isMatch) => {
         
          if (err) {
            return done(err);
          }
         
          if (isMatch) {
            return done(null, user); //cushty
          }
        
          return done(null, false, { msg: "Invalid email or password." });
        });

      });
    })
  );

  // passport.serialize and passport.deserialize commands are 
  //used to persist the users id as a cookie in the user's browser 
  //and to retrieve the id from the cookie when necessary

  // extracts part of user that needs to be saved in the session?
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // req.user is defined when you deserialize ? use above to get whole user object
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });

};

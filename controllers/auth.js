const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

// Render sign in page (Views)
//----------------------------------------------------------
//  router.GET ("/login", *yada controlla getLogin *
exports.getLogin = (req, res) => {
  if (req.user) { // wait wut? u got a req.user? ipso facto y'all good!
    return res.redirect("/profile"); // u already logged in child! here's ur profile
  }
  res.render("login", {   // show u the login page cuz u gonna need it! to log in
    title: "Login",
  });
}//----------------------------------------------------------



//sign IN! (talk to db)  
//----------------------------------------------------------
//    router.POST ("/login", *yada controlla postLogin *
//        <form action="/login" method="POST">  *** yummy req.body data! ***
//   
// Oh, we have a NEXT now... wow!
// handy required validator methys   :-)
exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });
// if validationErrors array has any elements redir to /login sucka! loop til no err
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
 }
 //normalize req.body.email data from form input
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });
// req.body incoming ala ejs   POST method  
// req INcoming! via router, req/res/next parmies into cust methy .postLogin
//   <input type="email" **yada** name="email"/>
//   <input type="password" **yada** name="password"

// NOTE: we have DO NOT have a user yet!!! 
// console.log(user)  // ReferenceError: user is not defined
// at exports.cogitationLogin (controllers/auth.js:41:13)  !!!!

//const passport = require("passport");
  // gonna be using "local" strategy in the required passport
  // we'll be talking to the database now...!
  // passport.js grabs lego User model via const User = require("../models/User");
  passport.authenticate("local", (err, user, info) => { // (p1, p2?, p3)?
    // so we have a user now... ! (as distinct from req.user) but how idk !?!!
    console.log('******* hi user !  passport.authenticate p2, arrow funky p2a *******')
    console.log(user)  // hello my sweet friend!

    // console.log(req.user)  // undefined ! not there yet pal

// did not work maybe fix maybe delete
    // getSession: async (req, res) => {
    //   try {
    //     const sess = await Session.findById("F6NMCIC7ZRzZPiq5RK_W4-YEj4x9OJ_p");
    //     console.log("hi session hahahahahaha");
    //     console.log(sess);
    //   }catch (err) {
    //     console.log(`take the L ${err}`);
    //   }}

//  WE TALKED TO THE DATABASE! Thanks passport ya did 'some stuff'! automagicakindaly
//     session collection, ex. document in db:
// {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},
// "passport":{"user":"6331fe6ab45bba531aea4216"}, // <-- hello my sweet friend!
// "flash":{}}

// if (err) *** || *** if (!user)  return 
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }

 // req.logIn (personHi, 2nd arg conditional --> error return || res.redirect profile pg)
        // req.logIn curtesy of passport, first parmy hiPerson, then funky do some whatev stuff
        // funky whatev stuff has err arg at disposal
        // "Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
        // ---   When the login operation completes  --------
        // ----  user will be assigned to req.user ---- !!oh wow!!! aka first parmy req.parmy1-----
        //https://stackoverflow.com/questions/59222740/passportjs-difference-between-authenticate-and-req-login#:~:text=Understanding%20passport.js%20authentication%20flow
    req.logIn(user, (err) => {
      if (err) {return next(err) }  // sux to be u, whoever u are!
      console.log('hi req.user nice to see you! courtesy of passport req.login') //  req.flash("success", { msg: "Success! You are logged in." }); 
      console.log(req.user) //user has been assigned to req.user! u did this req.logIn wowza!
      res.redirect(req.session.returnTo || "/profile");  //ur in babe!
    });
//
  })(req, res, next)  // what the heck? 
  // passport.authenticate("strat",(err, user, info)=>{ }) (req, res, next) 
  // are we returning a funky (req, res, next) 
  // is this how we passing req/res/next on? seems like? after res.redirect joy?

}  // end of exports.cogitationLogin *** whew! ***




//-------------  GET  -- LOGGOUT -------------------------------------------
// exports.logout = (req, res) => {
//   req.logout();
//   req.session.destroy((err) => {
//     if (err)
//       console.log("Error : Failed to destroy the session during logout.", err);
//     req.user = null;
//     res.redirect("/");
//   });
// }  *** the above is depreciated technique had to be updated as below ***
// yeah this was just a copy paste  kinda simple though, but had to be updated from above
// set req.user to null    manually if error
exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      console.log("Error : Failed to destroy the session during logout.", err);
      req.user = null;
    
    // internal note: redir here or below?  must be below right?!? someone told me diff, but think it's gotta be below
      }
      res.redirect('/'); 
      // kicked back to index landing page. Will no longer pass ensureAuth (but how/why?)
  });
}//--- res.redirect('/')  NO LONGER LOGGED IN !!! 


///---------    GET -- Sign UP ---renders Sign Up EJS ---------------------------
// Welcome, new friend
// it's all about the req, res
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/profile");
// u ain't a new friend, don't play around! U lost frendo? Here's your profile page, enjoy your stay!
  }
  res.render("signup", {
    title: "Create Account",
    // ball's in your court now human visitor...there is but one choice enter data & SUBMIT (button) 
    // however, you are human so there will be some validation in case data entered fails to meet some criterias
    // "/signup" method="POST" will be the next step!

  });
}//---- .getSignup gucci?  res.render("signup";  Chilling til human enter/submits





//--------- POST -- Sign UP ----------------------------------------------
// Oh, we have a NEXT now... wow!
// so, new friend, u'd like to be put in the db & then auth'd in to see ur stuff!?
exports.postSignup = (req, res, next) => {
  // Some quick data validation
  // hold errors here [] if any (no length in array if none)
  const validationErrors = [];
  // if req fail, show specific error(s)
  // using 'validator' required (is some middleware?)
  // whoa user NAME can be blank and pass validation/ no error ?!? okey, np i guess...
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({msg: "Password must be at least 8 characters long"});
  if (req.body.password !== req.body.confirmPassword) // wait wut now?? f/u "someday"
    validationErrors.push({ msg: "Passwords do not match" });

// if validationErrors array has any elements redir to /signup sucka!
  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("../signup");
    // try again, fix your data human! User u will be in this loop until ur data validates
  }
 //normalize req.body.email data from form input before putting in db
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  // and this is why we required the model! new doc to be put in db!
  //const User = require("../models/User");
  const user = new User({
    // here's our hc k:v's  w/v's from the (submitted) form data fields in the req.body
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });                                      
  // and that's user  so remember that.

  // look in db Users collection (pluralized in Mongo), if userName or email already exists
  // from a prior signup then duplicate cannot signup
  User.findOne(
    // first arg is hc array of 2 k:v's as 2 objys, as the find criteria to use MongoDB OR operator ( $or ) 
    // retrieve from db only those documents (if any) that match 1+ objy in the array.
       // why yes, i do have access to the req.body so, db u (already) got this stuff newFriend input?
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    // second arg is funky 2parmys  //what's w/these 2 parmys? f/u
    (err, existingUser) => {
      //conditional for err
      if (err) {
        return next(err);  //pop out w/next(errGahh!!!) if *rando?* err (?)
      }
       //conditional if mongo existingDocy ala {k1:v1} or {k2:v2} 
      if (existingUser) { //redir to signup pg!
        console.log(existingUser)
        req.flash("errors", {// already got email or userName in db, no dupes allowed!
          msg: "Account with that email address or username already exists in db!",
        });
        return res.redirect("../signup");
        // try again, fix your data human! User u will be in this loop until data submitted doesn't generate existingDocy from mongo
      } // if (existingUser)  dup! db already gots k:v in docs collection!
      user.save((err) => { // save doc in db! but 1st - any probs with mongo save?!
             //conditional 
        if (err) {
          return next(err);  //pop out w/next(errYo!!!) if *rando?* err (?)
        }
        // user is const vers of/(is?) instance of model  (lego piece)
        // req.logIn (disGuy, 2nd arg conditional error return || res.redirect)
        // req.logIn curtesy of passport, first parmy disGuy, then funky do some whatev stuff)
        // funky whatev stuff has err arg at disposal
        // "Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
        // ---   When the login operation completes  --------
        // ----  user will be assigned to req.user ---- !!oh wow!!! aka first parmy req.parmy1-----
        //https://stackoverflow.com/questions/59222740/passportjs-difference-between-authenticate-and-req-login#:~:text=Understanding%20passport.js%20authentication%20flow
        req.logIn(user, (err) => {
          console.log('******* hi new signed up user ! *******')
          console.log('**user assigned via hc const user = new User({userName: req.body.userName,email: req.body.email,password: req.body.password})**')
          console.log(user)
          console.log('*****and hi req.user - thanks .logIn via passport! ******')
          console.log (req.user)
          console.log('** i see req.user looks exactly like user but u 2 different lego pieces! ha ha ahghh!')
          if (err) {
            return next(err); //pop out w/next(errYo!!!) if *rando?* err (?)
          } 
          res.redirect("/profile");
          // YOU'RE IN BABY !!!!!  You've signed up (in db) AND logged in!
          // AND   user will be assigned to req.user   yay! so awesome lego piece!
        }); //**req.logIn
      });//** user.save
    }//** second arg -a funky- 4 User.findOne( p1, ()=>{} )  // took in 2parmys (err, existingUser)
  );// **User.findOne
}//---- .postSignup gucci?  res.redirect("/profile");

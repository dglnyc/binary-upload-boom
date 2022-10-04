//five parameters — exports, require, module, __filename, __dirname 
//are available inside each module in Node. 
//"paramys global to the code w/in a module yet they are local to the module"?
const express = require("express");

const app = express();  // costanza voice: "that's app, baby!"

const mongoose = require("mongoose"); //let's talk to mongo db!

//auth library w/mx authentication "strategies"
const passport = require("passport");

//authenticate users:*authorization* AND *storing user data*
//Sessions [vs. JSON Web Tokens (JWT/"jots")] //cookie-based session MW
const session = require("express-session"); 

// default Express session module-->returns a session store (methy that stores the session data into MongoDB); doesn't actually set up the session secret (that the server uses to sign the browser's cookie), 
// but just returns the** session storage engine that will be used**
//not IIFE syntax!- *chaining*?// here require() returns a funky 4u to call later :)
const MongoStore = require("connect-mongo")(session);

// Use forms for put / delete
// specific type of polymorphism (subtyping)
// When you define multiple functions which has the same name, the last one defined will override all the previously defined ones and every time when you invoke a function, the last defined one will get executed.
//Create a new middleware function to override the ***req.method*** property with a new value. This value will be pulled from the provided getter
// bcuz legacy default isn't to let user delete || change (nope!) just read || add HTTP
const methodOverride = require("method-override");

const flash = require("express-flash"); //
const logger = require("morgan");

const connectDB = require("./config/database");

//lets get access to those routes files, & their methys, shall we? YES!
const mainRoutes = require("./routes/main");
const cogitationRoutes = require("./routes/cogitations");
const commentRoutes = require("./routes/comments");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// passport config  requires *strategy mongoose User model*
// require() here returns a funky with (passport) as parmy
require("./config/passport")(passport);

//Connect To Database  requires mongoose process. and env secrets
connectDB();

//Using EJS for views
app.set("view engine", "ejs");


// app.use()  Methods passed into app.use()r MW
//basically helper methys that every request will go through.

//Static Folder
app.use(express.static("public"));

//Body Parsing  uhmm... okay. super!
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging - whoah!  [i guess i looked into this but forgot now]
app.use(logger("dev"));

//Use forms for put / delete  SUPER WHOA! 
//per documentation: use a query string [vs. header] value to override the method, 
//specify the *query string key* as a "string argy" to the methodOverride funky.
// ex. ejs:    <form method="POST" action="/blahblahblahEndpoint?_method=PUT">
//*  "endpointURL?_method=PUT"
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB -SO awesome
// MongoStore - kinda complekated but 'just rolling with it'
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//req.user is bundled into a request when there is a logged in user (based on session) trufax?
// approach not avail to be leveraged by react, must get deets from **backend** & store in react state

// Passport middleware - thanks passport!
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//-------------------------------------

// CONVENTION: *"app" can be replaced w/ router in a dedicated file //* "router, baby!" 

// Router funkys are Express middleware

// const mainRoutes = require("./routes/main"); get gremlins! //* module.exports = router
// const cogitationRoutes = require("./routes/cogitations"); // * module.exports = router
// samesies for [comment file in routes foldy] const =require for server, & in router file m.export router [that's router, baby!]

//Setup Routes app.use // app. now has gremlins/fancy smurfs! org'd in diff files in routes foldy
//* gremlins - controllas controll everything, but I listen to REQ, and tell *which* controlla to "do their thing"


//  / 	/profile	/feed 	/login	/logout	 /signup	<-- for these endpoints aka URLs
app.use("/", mainRoutes);                         // *came in on root ? ok here's ur router w/gremlins!

// ~~~~  root will be "/cogitation"
//  /:id		/createCogitation		/likeCogy/:Hid		/deleteCogitation/:id  <-- URLs
app.use("/cogitation", cogitationRoutes);         // *came in on /cogitation? ok here's ur router w/gremlins!

// ~~~~  root will be "/cogitation/comment"
// /createComment 
app.use("/unicornComment", commentRoutes);          // *came in on cogitation/comment? ok here's ur router w/gremlins!

//------------------------------------------

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});

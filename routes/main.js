const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const cogitationsController = require("../controllers/cogitations");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - "simplified for now" -LN ... hm... okey...

//CONVENTION: app can be replaced with router in a dedicated file


// IT ALL STARTED HERE: controller --> "Let there be html/etc" and not all blank whiteness
//  ... user action required, 2 paths  Returning user "log it!" Stranger "introduce yourself & set password"
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, cogitationsController.getProfile);
router.get("/feed", ensureAuth, cogitationsController.getFeed);

// ok, here's the authController stuff

router.get("/login", authController.getLogin);  //render user login page
router.post("/login", authController.postLogin); // 


// slight updates requried by passport, changes made
router.get("/logout", authController.logout);


// last in list, but first encounter by user w/db
// let's try signing user up, we'll render lovely signup page inc'd a form
//  & inc'd some quick basic data validation scaffolding (error msgs)
router.get("/signup", authController.getSignup);
// User will enter deets & User will click submit and then on to next steps!
//  "/signup" method="POST"

// my time at last! (or rather, almost first) Let's POST !!! Or try to!
router.post("/signup", authController.postSignup);
// Let's quick-validate that data, User! 
//if fail, show msg, User u fix & sux to be u bcuz u gotta retype everything!





module.exports = router;

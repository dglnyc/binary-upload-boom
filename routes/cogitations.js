const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const cogitationsController = require("../controllers/cogitations");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//CONVENTION: app can be replaced with router in a dedicated file 
// "that's router, baby!" -G.Costanza

//* root is "/cogitation"  for this route !!!!! 
//  so, no need to type   /cogitation   out in first parmys! it's implicit, already included for all in this file, per app.use( )
// here's our endpoints-->  /:id  /createCogitation  /likeCogy/:Hid  /deleteCogitation/:id  <-- URLs
// server.js deets:
//*  const cogitationRoutes = require("./routes/cogitations");  
//*  app.use("/cogitation", cogitationRoutes); 

//Cogitation Routes - "simplified for now" -LN
router.get("/:id", ensureAuth, cogitationsController.getCogitation);
 
// oh hai MW multer, doing some validation for imgs are we?
router.post("/createCogitation", upload.single("file"), cogitationsController.createCogitation);



// just for funsies switched up the naming for the likes router.put
// param and methy names are wonky for visability!
router.put("/likeCogy/:Hid", cogitationsController.likeCogitation);


//<form action="/cogitation/deleteCogitation/<%= post.id %>?_method=DELETE"method="POST">
// oh, so it's .DELETE you say? groovy. Ima need that query parmy o'course in the route
// let's leverage the URL to grab that lovely post db info, shall we? YES, we shall!!! 
router.delete("/deleteCogitation/:id", cogitationsController.deleteCogitation);



module.exports = router;

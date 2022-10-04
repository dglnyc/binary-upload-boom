const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");

// server.js
//    const commentRoutes = require("./routes/comments"); **[folder path & ] file name!**
//    app.use("/unicornComment", commentRoutes)    endpoint, aRoutesFile.methy
//            *endpoint – the single “unit” of an API = a URL 
// every endpoint is a URL, aka "Uniform Resource Locator"

//*  app.use( "url endpoint" , a-methy-from-a-routes-file)
//* app.use --> on this URL w/an incoming req  --> use this method !

//router  .POST  baby!
// on incoming REQ  we're going to POST  (p1, p2)   (endpoint, methy-from-a-controlla)
router.post( "/createComment/:id",commentsController.createComment)

module.exports = router;
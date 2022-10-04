const Comment = require("../models/Comment");

module.exports = {

  // 2 WONDERFUL parmy's req oby and res obj
  // we got the Comments model to work with! gonna need that since we'll be talking to the db!
  //  
//*how did we get here? it all starts with the big app!  in the server.js file
//* app.use("/unicornComment", commentRoutes) // server.js required a routes file
// oh app, ur gonna prepend everything that fits most specifically in ur 1st parmy slot with that as the ROOT path? Ok, i gotta rememba that!
// in the specific routes file, app.use( ___, parmy2) we have a cool comment router w/http methys! hey there comment gremlin!

//   cogitation.ejs files file:
//* <form action="/unicornComment/createComment/<%=cogitation._id%>"  method="POST">
// so in the views, the user submitted a request to an endpoint (aka URL), 
// using the POST http methy 

// and it went to big app, fit in the pathway /unicornComment
// so it went to the router file specified, 
// where we found this awesome router methy 
// an yes ma'am it fits!
// /unicornComment/createComment/<%=cogitation._id%>"  method="POST"  (gotta 'memba big app prepended with it's parmy1 for this routes file's router)
//* router.post( "/createComment/:id",commentsController.createComment)
// and here we are, with the .createComment taking an incoming request, yay!  
createComment: async (req, res) => {
// it was a form POST u say? so ejs had a req.body to send along, what were those fields again?
// hey! we're doing a comment but that form submitted was in the *cogitation partial* ! okeydokey, confusing but also "totally obviously makes sense"
// the viewer was looking at the COGITATION when they wanted to make a COMMENT on it!
//*  <textarea class="form-control" id="commentText" name="commentText"></textarea>
// so, nice: keeping it simple there's just one field, a textarea called commentText. cool
try {
    //   console.log(`HELLO!!! mostly only if ur post was sucessful u will see here some interesting info lemmie introduce u to the req.params cira now`)
    //   console.log(req.params)
    //   console.log('***req.body below...')
    //   console.log(req.body)

// so what was that endpoing (URL) again?  omg it was dynamically generated! how?
// wait, who did you say created the view the user was looking at to press this button?
// WHO MADE THE BUTTON? And the Form!?  I need to talk to that controlla! 
//* /unicornComment/createComment/<%=cogitation._id%>

// turns out the getCogitation controlla  told the ejs cogitation partial how to spit out the html
// that getCogitation controlla did some fancy stuff! 
      await Comment.create({
        commentText: req.body.commentText,
        likes: 0,
        cogitation: req.params.id, 
        // commentTitle: req.body.commentTite
      });
      console.log("Comment has been added!");
   
      res.redirect("../../cogitation/"+req.params.id);
    // cogitations controller handles rendering of cogitation ejs partial w. comments incl'd
    } catch (err) {
      console.log(err);
    }
  },


  
}
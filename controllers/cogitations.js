const cloudinary = require("../middleware/cloudinary");
const Cogitation = require("../models/Cogitation");
const getCogitation = require("./cogitations")
const Comment = require("../models/Comment")

module.exports = {  // a buncha async funkys used by cogitation router

// here we gooooo! 2 parmy's REQ oby and RES obj
// res.render amigos landing pg after login 
// we got the Cogitation model to talk to db! gonna need that!
// req.user courtesy of passport via req.login, thanks passport!
  getProfile: async (req, res) => {
    try {
      const cogitations = await Cogitation.find({ user: req.user.id });
      // console.log(cogitations)  -- oh lookie, an array of objects, the user's cogys found in db!
      // hey mongodb! in Cogitations collection find {k:v}  cool? { user: ##1##2##0##9 }
      res.render("profile.ejs", { cogitations: cogitations, user: req.user });
      // spit out the html! (ejs- gonna need some sorta-js for that haha!),
      // here's a lil oby i smooshedup/made that i'd like u to have for that html {k:v, k:v}
     // cogitations:{db docy oby wowza!}  & good ol user: *thankU4infoPassport!*
    } catch (err) {
      console.log(err);  // mongodb, why u no find that k:v {user:blahblah} !? they should be in there! whoops!???
    }
  },

  // here we gooooo! 2 parmy's y'all req oby and res obj
  // we got the Cogitations  model to talk to db! gonna need that!
  // res.render feed.js getting all the docys from the db Cogitations collection
  getFeed: async (req, res) => {
    try {
      const cogitations = await Cogitation.find().sort({ createdAt: "desc" }).lean();
      console.log(cogitations[0]._id)
      console.log(cogitations[0].id) // interestingly, this is undefined with .lean() if u remove .lean() then it has same val as _id
      // lean() "returns a JavaScript object instead of a Mongoose document"
      // this controlla's cogitations is an array of *everyone's cogy docys* in db!   .find()  find all of 'em!
      // oh, & we're sorting all the db docys by date, that's thoughtful of us! .find() <-- so u want everthing? got it!
      res.render("feed.ejs", { cogitations: cogitations });
      // spit out some html (ejs ilu ), & take this oby to do it! i just made it, smushed it up for u
      // cogitations: {db cogys}  // k:v   oh, how nice - they're all sorted by date, #blessed!
    } catch (err) {
      console.log(err);
    }
  },


  // hey amigo, want to see just one cogitation? Let's do it!  (req, res)!

  // our gremlin aka router listened for the URL aka endpoint, and told the right controlla to go into action!
  // this endpointURL is used 2 places so far, *feed* & *profile* ejs files!
  //* <a href="/cogitation/<%= cogitations[i]._id%>"> ***yada img*** </a> <-- from ejs files
  // so, ur telling me u used an array elements key of _id to dynamically generate a URL !
  // ex. "/cogitation/1230321"  and that URL is guaranteed to be unique bcuz MONGO added that k:v to the cogy docy in db? (it's not in the model schema!)  
  //*router.get("/:id", blahblahMW, yada.getCogitation);  <-- from routes file  
  // and that when the gremlin aka router heard it, it interprets THAT PORTION as param
  // and that param is included with the req  -- OMG what is this sorcery!!! cool, cool...
  // so now we have a req.param.id   // haha the : colon symbol isn't included, that just tells gremlin aka router how to see/interpret the incoming endpointURL
  getCogitation: async (req, res) => {
    try {
      // oh wow, fancy, we're using params from the req!
      //* <a href="/cogitation/<%= cogitations[i]._id%>"> ***yada img***  </a>
      // another controller had ejs wrap all the images in anchor tags, linking to cogitation/docy._id
      // meaning the incoming params of cogitation/######     [w. cogitation being the root path of router]
      // will be req.params == mongo _id  (since those mongo docy _id k:v's were used to to build the anchor url lego piece in ejs files (aka views) by the getProfile controlla) 
      // here's the router that called our current controlla  
      //* router.get("/:id", MW, yadaControlla.getCogitation) 
      // I'm the controlla! u called me? with some param? sweet!!!
      const cogitation = await Cogitation.findById(req.params.id); //oh btw, the : in router isn't included, just the .id part
      // sure, i'll findByID(######)  -- u say that's the Cogitation u want? np! here's the only one, it's unique _id!
      console.log('cogitation') 
      console.log(cogitation)  
      console.log('~~~~~~~~~~~~~~~~~~~~ ')
      console.log('cogitation._id  is type of '+typeof(cogitation._id))
      console.log(cogitation._id)
      console.log('~~~~~~~~~~~~~~~~~~~~ ')
      console.log('cogitation.id  is type of '+typeof(cogitation.id))
      console.log(cogitation.id)
      console.log('cogitation.id==cogitation._id')
      console.log(cogitation.id==cogitation._id)
      console.log('cogitation.id===cogitation._id')
      console.log(cogitation.id===cogitation._id)
// so it turns out we're getting a string from the mongo _id object but it's a weirdo-mongoose-generated string  .lean() &u won't get xtra stuff, inc'd the weirdo-string .id

// anyway, moving on to the next thing to do in this getCogitation controlla to render the ejs for a cogy
//                                        *router.get("/:id", blahblahMW, yada.getCogitation);  <-- from routes file  
// array to hold comments for the cogy!   oh lovely router, you structured a param called id for our controller, the : is just an operator
              // we shall make use of it again here:               because our Comment model has a k:v where val is cogy _id!
      const comments = await Comment.find({cogitation:req.params.id})
      console.log('comments  _id and .id == but NOT === ! _id object vs .id string !')
       if(comments.length>0){      
        console.log(comments[0]._id)
        console.log(comments[0].id)}
 // just randomly i was curious how the heck i got this .id string-i-never-made-that-does-NOT-show-up-in-the-OBJECT - wha...???! so it's automagical js/mongoose/mongo
      res.render("cogitation.ejs", { cogitation: cogitation, user: req.user, comments:comments });
      // yay, let's render that cogitation! bet u want to know if it should show delete button on not!
      // let's not get crazy w/having people be able to delete other ppl's cogitations! haha

    } catch (err) {
      console.log(err);
    }
  },


 
  // we got the  Cogitation  model to work with! gonna need that to talk to db!
  // gonna do some cloudinary stuff, which btw will be validated with multer MW
  // then build a Cogitation to go in db
  // & then redir to refresh/reload the page 

  //let's check out the router that called me!
  //* router.post("/createCogitation", mwMethy("file"), cogitationsController.createCogitation);
  createCogitation: async (req, res) => {
    try {
      console.log(`HELLO!!! only if ur post was sucessful u will see here some interesting info lemmie introduce u to the req.file cira now`)
      console.log(req.file)
      console.log('***req.body below...?')
      console.log(req.body)

      // Upload image to cloudinary
     // <input type="file" class="form-control" id="imageUpload" name="file">
      const result = await cloudinary.uploader.upload(req.file.path);
      // and that's result! u could console log that if u wanted!

      // let's grab our user from the req.login generated req.user which mirrored our User model, smancy!
      await Cogitation.create({
        title: req.body.titleyay,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id, 
      });
      console.log("Cogitation has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  
  // here we gooooo! 2 parmy's y'all req oby and res obj
  // let's look at the route that called me:
  // router.put("/likeCogy/:Hid", cogitationsController.likeCogitation)
  // sweet, so i came in on the cogitations/likeCogy/id  URL   [cogitations was the root path]
  // and i have a :id  param, fancy!!  I'm the controlla, so let's do some cool stuff!
  likeCogitation: async (req, res) => {
    try {
      await Cogitation.findOneAndUpdate(
        { _id: req.params.Hid },
        {
          $inc: { likes: 1 },
        }
      ); 
// above, so, we're gonna findOneAndUpdate({k:v}, $wowza {k:v})  ie.{findthis},{dothis to the docy of the thing u found}
// and, um, u want me to find the docy {_id: ##### } using the URL param for val of key _id 
// np, we can do that! where did the user click on the link to get to me again?
// from the views of course! cogitation.ejs in this case...
// <form method="POST" action="/cogitation/likeCogy/<%= cogitation.id %>?_method=PUT">

console.log("Likes +1");
      console.log("req.params property is an objy containing properties mapped to that route's 'parameters'")
      console.log("in this case that would be '/likeCogy/:Hid'")
      console.log(req.params)
      res.redirect(`/cogitation/${req.params.Hid}`);
    } catch (err) {
      console.log(err);
    }
  },

  // here we gooooo! 2 parmy's y'all req oby and res obj
  deleteCogitation: async (req, res) => {
    try {
      // Find post by id
      let post = await Cogitation.findById({ _id: req.params.id });
      // Delete image from cloudinary
      // holy cow!
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Cogitation.remove({ _id: req.params.id });
      console.log("Deleted Cogitation");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};

module.exports = {
  // Hello req res my old friends
  getIndex: (req, res) => {
    // turn on the lights, baby! we don't want all blank whiteness!
    res.render("index.ejs");
    // ball's in your court now human visitor... two actions provided in the page loaded (sign in || sign up)
  },
};

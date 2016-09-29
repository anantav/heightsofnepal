var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");


//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


//SHOW REGISTER FORM
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var username    = req.body.username,
        email       = req.body.email,
        firstname   = req.body.firstname,
        lastname    = req.body.lastname;
    
    var newUser = new User({username: username, email: email, firstname:firstname, lastname: lastname});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
          req.flash("success", "Welcome! "+user.username);
          res.redirect("/sites"); 
       });
   });
});

//LOGIN FORM ROUTES 
router.get("/login", function(req, res){
    res.render("login"); 
});

//Handle login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/sites",
        failureRedirect: "/login"
    }), function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.logout();
    req.flash("notice", "You have LoggedOut!");
    res.redirect("/sites");
});





module.exports = router;
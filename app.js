var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Site            = require("./models/site"),
    Comment         = require("./models/comment"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");

//REQUIRING ROUTES    
var commentRoutes       = require("./routes/comments"),
    siteRoutes    = require("./routes/sites"),
    indexRoutes         = require("./routes/index");
    
mongoose.connect("mongodb://localhost/HON_deployed");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

 


//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "Once again Venny wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   res.locals.notice      = req.flash("notice");
   next();
});

app.use(indexRoutes);
app.use("/sites", siteRoutes);
app.use("/sites/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("HON Server Started"); 
});
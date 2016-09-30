var express     = require("express");
var router      = express.Router();
var Site        = require("../models/site");
var middleware  = require("../middleware"),
multer          = require("multer"),
upload          = multer({ dest: './public/images/upload' });

//INDEX - SHOW ALL CAMPGROUND
router.get("/", function(req, res){
        //Get campground from db
        Site.find({}, function(err, allSites){
            if(err){
                console.log(err);
            }else{
                res.render("sites/index",{sites:allSites, currentUser:req.user});
            }
        });
});

//CREATE - ADD NEW CAMP TO DB
router.post("/", middleware.isLoggedIn, upload.single('image'),function(req, res){
   //get data from form and add to campgrounds array
    if(req.file) {
        console.log('Image is uploading...');
        var image = req.file.filename;
        console.log('Image upload complete!');
    } else {
        console.log('No Image uploaded!');
        var image = 'noimage.jpg';
    }
   var name     = req.body.name;
   var image    = image;
   var desc     = req.body.description;
   var author = {
     id         : req.user._id,
     username   : req.user.username
   };
   var newSite = {name: name, image: image, description:desc, author:author};
   //Create a new campground and save to DB
   Site.create(newSite, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newSite);
            req.flash("success", "New site created!");
            res.redirect("/sites");
        } 
   });
});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("sites/new");
});


//SHOW - shows more info about one compound 
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Site.findById(req.params.id).populate("comments").exec(function(err, foundSite){
        if (err){
            console.log(err);
        }else {
            //render show template with that campground
            res.render("sites/show", {site: foundSite});
        }
    });
});

//EDIT FORM
router.get("/:id/edit", middleware.checkSiteOwnership, function(req, res){
        Site.findById(req.params.id, function(err, foundSite){
            if(err){
                console.log(err);
            } else {
                res.send("The edit route is under construction! Sorry for the inconvinience");
                //res.render("sites/edit", {site: foundSite});
            }
        });
});

//UPDATE Route for campground update
/*router.put("/:id", middleware.checkSiteOwnership, upload.single('image'),function(req, res){
    if(req.file) {
        console.log('Image is uploading...');
        var image = req.file.filename;
        console.log('Image upload complete!');
    } else {
        console.log('No Image uploaded!');
        var image = 'noimage.jpg';
    }
   var name     = req.body.name;
   var image    = image;
   var desc     = req.body.description;
   var newSite = {name: name, image: image, description:desc};
    Site.findByIdAndUpdate(req.params.id, newSite, function(err, updatedSite){
        if(err){
            res.redirect("/sites");
        } else{
            req.flash("success", "Site updated!");
            res.redirect("/sites/" + req.params.id);
        }  
    });
}); */

//DELETE ROUTE FOR CAMPGROUND
router.delete("/:id", middleware.checkSiteOwnership,function(req, res){
    Site.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/sites/");
       } else {
           req.flash("error", "Site deleted!");
           res.redirect("/sites/");
       }
    });
});



module.exports = router;
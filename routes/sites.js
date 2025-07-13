var express     = require("express");
var router      = express.Router();
var Site        = require("../models/site");
var middleware  = require("../middleware"),
multer          = require("multer"),
upload          = multer({ dest: './public/images/upload' });


router.get("/", function(req, res){
        Site.find({}, function(err, allSites){
            if(err){
                console.log(err);
            }else{
                res.render("sites/index",{sites:allSites, currentUser:req.user});
            }
        });
});


router.post("/", middleware.isLoggedIn,upload.single('image'), function(req, res){
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


router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("sites/new");
});



router.get("/:id", function(req, res){
    Site.findById(req.params.id).populate("comments").exec(function(err, foundSite){
        if (err){
            console.log(err);
        }else {
            res.render("sites/show", {site: foundSite});
        }
    });
});

router.get("/:id/edit", middleware.checkSiteOwnership, function(req, res){
        Site.findById(req.params.id, function(err, foundSite){
            if(err){
                console.log(err);
            } else {
                /*res.send("The edit route is under construction! Sorry for the inconvenience");*/
                res.render("sites/edit", {site: foundSite});
            }
        });
});

//UPDATE Route for site update
router.put("/:id", middleware.checkSiteOwnership, function(req, res){
    Site.findByIdAndUpdate(req.params.id, req.body.site, upload.single('image'),function(err, updatedSite){
        if(err){
            res.redirect("/sites");
        } else{
            req.flash("success", "Site updated!");
            res.redirect("/sites/" + req.params.id);
        }  
    });
}); 

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

var express     = require("express");
var router      = express.Router({mergeParams: true});
var Site  = require("../models/site");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");


//COMMENTS NEW
router.get("/new", middleware.isLoggedIn,function(req, res){
   //find campground by id        
    Site.findById((req.params.id), function(err, site){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {site: site}); 
        }
    });
   
});


//COMMENTS CREATE
router.post("/", middleware.isLoggedIn,function(req, res){
   //Lookup campgrounds using ID
   Site.findById(req.params.id, function(err, site){
       if(err){
           console.log(err);
           res.redirect("/sites");
       } else {
           //create new comment
           Comment.create(req.body.comment, function(err, comment){
                if(err){
                   console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment 
                    //connect new comment to campground
                    comment.save();
                    site.comments.push(comment);
                    site.save();
                    //redirect campground show page
                    res.redirect("/sites/" + site._id);
                } 
           });
       }
   });
});

//EDIT ROUTES
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {site_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE ROUTES
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/sites/"+req.params.id);
       }
    });
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/sites/"+req.params.id);
       }
   });
});



module.exports = router;
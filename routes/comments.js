var express     = require("express");
var router      = express.Router({mergeParams: true});
var Site  = require("../models/site");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");


router.get("/new", middleware.isLoggedIn,function(req, res){
    Site.findById((req.params.id), function(err, site){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {site: site}); 
        }
    });
   
});


router.post("/", middleware.isLoggedIn,function(req, res){
   Site.findById(req.params.id, function(err, site){
       if(err){
           console.log(err);
           res.redirect("/sites");
       } else {
           Comment.create(req.body.comment, function(err, comment){
                if(err){
                   console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    site.comments.push(comment);
                    site.save();
                    var datetime = new Date();
                    console.log(datetime);
                    res.redirect("/sites/" + site._id);
                } 
           });
       }
   });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {site_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/sites/"+req.params.id);
       }
    });
});

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
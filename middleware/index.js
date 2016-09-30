var middlewareObj   = {},
    Site      = require("../models/site"),
    Comment         = require("../models/comment");
    
    
middlewareObj.checkSiteOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Site.findById(req.params.id, function(err, foundSite){
            if(err){
                res.redirect("back");
            } else {
                if (foundSite.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You are not authorized to do that!");
                    res.redirect("back");   
                }
            }
        });
    } else {
        req.flash("error", "You are not authorized to do that!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");   
                }
            }
        });
    } else {
        req.flash("error", "You are not authorized to do that!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to login first!");
    res.redirect("/login");
};



module.exports = middlewareObj;


var express 	= require("express");
var router		= express.Router();
var Site		= require("../models/site");
var User		= require("../models/user");
var middleware	= require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
	User.findById(req.params.user_id, function(err, foundUser){
		if(err){
			console.log(err);
		}else{
			res.render('users/profile_show');
		}
	})
})

module.exports = router;
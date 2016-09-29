var mongoose    = require("mongoose");
var Site  = require("./models/site");
var Comment     = require("./models/comment");

var data = [
     {  
        name        : "Nagarkote",
        image       : "http://www.trektoursinnepal.com/images/camping-trek-in-nepal.jpg",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
     },
     {  
        name        : "Mustang",
        image       : "http://4.bp.blogspot.com/_2t4NSadMxtg/TPyn2-oHGzI/AAAAAAAABM0/TTveJgQvZT8/s1600/Khopra+Ridge+Before+Dawn.jpg",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
     },
     {  
        name        : "Everest",
        image       : "http://everestbasecamptrekguide.com/img/everest-base-camp.jpg",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
     },
     {  
        name        : "Annapurna",
        image       : "http://www.wildernessexcursion.com/uploaded/gallery/annapurna-base-camp-trekking-13.jpg",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
     }
    ]


function seedDB(){
    //Remove all campgrounds
    Site.remove({}, function(err){
        if (err){
            console.log(err);
        }else{
            console.log("remove campground");
            //Add a few campgrounds
            data.forEach(function(seed){
               Site.create(seed, function(err, campground){
                   if (err){
                       console.log(err);
                   }else{
                       console.log("added a new campground");
                       //Add comment
                       Comment.create(
                        {
                            text    : "This place is great, but I wish there was mojo",
                            author  : "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                       });
                   }
               }) 
            });
        }
        
    });
}

module.exports = seedDB;
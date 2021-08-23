const expresserror = require("./utilities/expresserror");
const {campgroundSchema,reviewSchema}=require("./schemas.js");
const Campground = require("./models/campground");
const Review=require("./models/reviews")



module.exports.ensureLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        
        req.flash("error","go and login");
        return res.redirect("/login");
    }

    next();
}


 module.exports.validateCampground= (req,res,next)=>{

   
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        // map and create a single string from all objects present in the error
        throw new expresserror(msg, 400);
    }
    else{
        next();
    }

}


module.exports.isAuthor =async (req,res,next)=>{
    const {id}=req.params;
    const campground = await Campground.findById(id);
    if( !campground.author.equals(req.user._id)){

        req.flash("error","sorry, no permission for this task");
         return res.redirect(`/campgrounds/${id}`);


    }

    next();

}


module.exports.isreviewAuthor =async (req,res,next)=>{
    const {id,reviewId}=req.params;
    const review = await Review.findById(reviewId);
    if( !review.author.equals(req.user._id)){

        req.flash("error","sorry, no permission for this task");
         return res.redirect(`/campgrounds/${id}`);


    }

    next();

}

module.exports.validateReview= (req,res,next)=>{

   
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        // map and create a single string from all objects present in the error
        throw new expresserror(msg, 400);
    }
    else{
        next();
    }

}
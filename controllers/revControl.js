
const Review = require("../models/reviews");
const Campground = require("../models/campground");



module.exports.addrev=async(req,res,next)=>{
    const campground= await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","review added!")
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.delrev=async(req,res)=>{
    const {id,reviewId}= req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); // here the pull is a special operator that pulls out(removes) all the values from reviews field having reviewId
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);

}
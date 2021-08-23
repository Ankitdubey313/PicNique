
const express=require("express");
const router=express.Router({mergeParams:true});

// this is so that i can use the :id in the general route specified on app.js

const revCon=require("../controllers/revControl.js")


const catchAsync =require("../utilities/catchAsync.js");
const {validateReview,ensureLogin,isreviewAuthor}=require("../middleware")






router.post("/", ensureLogin,validateReview,catchAsync(revCon.addrev))


router.delete("/:reviewId", ensureLogin,isreviewAuthor,catchAsync(revCon.delrev))

module.exports=router;


const express=require("express");
const router=express.Router();
const catchAsync =require("../utilities/catchAsync.js");
const campControl=require("../controllers/campControl.js")

const { ensureLogin,isAuthor,validateCampground } = require("../middleware.js");

const multer =require("multer");
const {storage}=require("../cloud") // by default it will go to the index.js 🎇
const upload=multer({storage});


router.route("/")
.get(catchAsync(campControl.index ))
.post(ensureLogin,upload.array('campground[image]'),validateCampground, catchAsync(campControl.addcamp))

// we are uploading the images and then validating otherwise my upload method wont have access to req.body :(

router.get("/new", ensureLogin,campControl.newpage)

// this has to come before the id wala route bcz it will then try to match the id route


router.route("/:id")
.get(catchAsync(campControl.show)) //this is the show page 
.put(ensureLogin,isAuthor,upload.array('campground[image]'), catchAsync(campControl.update))
.delete(ensureLogin, isAuthor,catchAsync(campControl.delete)) 




router.get("/:id/edit",ensureLogin,isAuthor, catchAsync(campControl.showedit))







module.exports=router;
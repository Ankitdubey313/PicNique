const express=require("express")
const router=express.Router();
const passport=require("passport")
const catchAsync = require("../utilities/catchAsync.js")
const authCon= require("../controllers/authControl.js")


router.route("/register")
.get(authCon.getRegister)
.post(catchAsync(authCon.postRegister));

router.route("/login")
.get(authCon.getLogin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:"/login"}),authCon.confirmlogin)


router.get("/logout",authCon.logout)
module.exports=router;


// i try to stick to best practises and always stick to the MVC model 😁
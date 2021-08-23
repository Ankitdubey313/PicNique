const mongoose= require("mongoose");
const passportLocalMongoose =require("passport-local-mongoose")
const Schema=mongoose.Schema;

const userSchema= new Schema({
    email:{
        
        type:String,
    required:true
      }
});

userSchema.plugin(passportLocalMongoose); // directly adds the password functionality without us explicitly mentioning it


module.exports= mongoose.model("User",userSchema);
if(process.env.NODE_ENV!=="production"){
    require("dotenv").config()
}


const express = require("express");
const flash=require("connect-flash");
const session=require("express-session")
//express is required to set up the routes and the default port


const app = express();


const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const { url } = require("inspector");
const engine = require("ejs-mate"); 


const expresserror = require("./utilities/expresserror");


const authRoutes= require("./routes/auth.js");
const camproutes=require("./routes/camproutes.js");
const reviews=require("./routes/reviewRoutes.js");

const passport=require("passport"); // this helps in getting a pbkdf2 style hash which is platform independent
const LocalStrategy=require("passport-local");
const user = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const db_url=process.env.DB_URI

const MongoStore = require('connect-mongo');




mongoose.connect(db_url||"mongodb://localhost:27017/theProject", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useFindAndModify:false
});

// the mongoose.connect helps establishing a database named theproject at the standard url



const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(" db connected");
});

app.engine("ejs", engine);


app.use(express.urlencoded({ extended: true }))
// this is to parse the req.body

app.use(methodOverride("_method"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// many paths can be made into 1 using path.join()
app.use(express.static(path.join(__dirname,"public")))
app.use(mongoSanitize()); // to stop some shaitan queries which include unwanted symbols like $ and all

const secret= process.env.SECRET||"thisshouldbeabettersecret";

const store = MongoStore.create({
    mongoUrl: db_url||"mongodb://localhost:27017/theProject",
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
// we are not using memory store now , we use mongo store to store the sessions
store.on("error",(e)=>{
    console.log(e);
})

const sessionConfig = {

    store,

    name:"thisissomename",
    
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // to ensure persistent login sessions
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser()); // these 2 are for storing and retrieving from the session




app.use((req, res, next) => {

    if (!['/login', '/register', '/'].includes(req.originalUrl)) {

        req.session.previousReturnTo=req.session.returnTo;

        req.session.returnTo=req.originalUrl;
    }

    // sets the return to property

    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use("/",authRoutes);
app.use("/campgrounds",camproutes);
app.use("/campgrounds/:id/reviews",reviews);



app.get("/", (req, res) => {
    res.render("home.ejs");
})




app.all("*",(req,res,next)=>{
    req.session.returnTo = req.session.previousReturnTo;
    next(new expresserror("page not found",404))
})
// here when i throw a new error the express error .js file changes the message and status code and passes on to the next route

app.use((err,req,res,next)=>{
    const {statusCode=500,message="something is out of order"}=err;
    res.status(statusCode).send(message);
})// the thrown error is handled here from whatever route it is

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`on port ${port}`);
}) //default port
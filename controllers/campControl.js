const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloud");
const ObjectID = require('mongodb').ObjectID;


module.exports.index=async (req, res) => {

    const Passed_camps = await Campground.find({});
    res.render("campgrounds/index", { Passed_camps });
}


module.exports.newpage=(req, res) => {
   
    res.render("campgrounds/new")
}


module.exports.show=async (req, res,next) => {


    if (!ObjectID.isValid(req.params.id)) {
        req.session.returnTo = req.session.previousReturnTo;
        // console.log('Invalid campground show id, returnTo reset to:', req.session.returnTo);
    }

    // favicon bug resolved!!

    
    const campground =  await Campground.findById(req.params.id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
}).populate("author");
   // when the scale of the app increases i will rather not populate the campground with so many reviews which is unnecessary but rather i will infinite scroll in batch of 20-30 that is paginate
   
   
   
    if(!campground){
        req.flash("error","there is no campground boss");
        return res.redirect("/campgrounds");
    }
  
    else   res.render("campgrounds/show", { campground });
}

module.exports.showedit=async (req, res,next) => {

    const campground = await Campground.findById(req.params.id);
   
    res.render("campgrounds/edit", { campground });

}

module.exports.update=async (req, res,next) => {

    
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
        //spreads the title and location from the campground

   

     const img=req.files.map(f=>({url:f.path,filename:f.filename}));
     campground.images.push(...img);
     // this will spread the new pics and not overwrite the previous ones

     // can directly update all at once but its ok!

    
     await campground.save();
    

     if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

     

    req.flash("success","successfully updated a campground");
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.addcamp=async (req, res,next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;

    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}))

    campground.author=req.user._id;

    console.log(campground);
    
    await campground.save();

    console.log(campground);
    req.flash('success',"new camp added")
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.delete=async (req, res,next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}
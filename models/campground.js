const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews");

const ImageSchema = new schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_150');
});

ImageSchema.virtual('cardImage').get(function() 
{   return this.url.replace('/upload', '/upload/ar_4:3,c_crop'); })
// i am doing this to make sure that my template is lightweight also i learnt a cool new feature

const CampgroundsSchema = new schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // as per geoJson this has to be point only also this format works best with all the operation that is supoorted by mongo and so we dont store latitude and longitude seperately
            
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author:{

        type:schema.Types.ObjectId,
        ref:"User"

    },
    reviews:[{

        type:schema.Types.ObjectId,
        ref:"Review"

    }]
}); //schemadefinition 

CampgroundsSchema.post("findOneAndDelete",async (doc)=>{

    if(doc){
        await Review.deleteMany({

            _id:{
                $in:doc.reviews
            }
               

        })
    }

})

module.exports = mongoose.model("campground", CampgroundsSchema);
//exporting the schema

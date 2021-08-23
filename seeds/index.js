const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedhelpers");

//uses the imported datasets

mongoose.connect("mongodb://localhost:27017/theProject", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(" db connected");
});
//to check if the datbase has been connected properly or not
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await campground.deleteMany({});

    for (let i = 0; i < 50; i++) {

        const randNum = Math.floor(Math.random() * 1000);

        const price = Math.floor(Math.random() * 50);
        const c = new campground({

            author:"611409a0d35a6b42d0ff86f8",
            location: `${cities[randNum].city}, ${cities[randNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            
            description: " this is a really cool campground",
            price,
            geometry:{ type: 'Point', coordinates: [ 72.83333, 18.96667 ] },// setting some default
            images:[
                {
                 
                  url: 'https://res.cloudinary.com/formyplacement2022iitbhu/image/upload/v1629089225/theProject/wvunsshb9vcoqrquj5kv.jpg',
                  filename: 'theProject/wvunsshb9vcoqrquj5kv'
                },
                {
                 
                  url: 'https://res.cloudinary.com/formyplacement2022iitbhu/image/upload/v1629089224/theProject/qdg2cavf5jbkl0dmrrus.jpg',
                  filename: 'theProject/qdg2cavf5jbkl0dmrrus'
                },
                {
                 
                  url: 'https://res.cloudinary.com/formyplacement2022iitbhu/image/upload/v1629089224/theProject/sbmw6sb5mpmpnbusk8mh.jpg',
                  filename: 'theProject/sbmw6sb5mpmpnbusk8mh'
                }
              ]
        });
        await c.save();
    }

}


seedDb().then(() => {
    mongoose.disconnect();
});
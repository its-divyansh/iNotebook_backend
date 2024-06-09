const mongoose =require ('mongoose');
require('dotenv').config()

const mongoURI=process.env.MONGODB_URI;
// console.log(mongoURI)

const connectToMongo =async()=>{
    // here we can use async and await also, but we have used a callback fuction instead, but newer version doesnot accept callback so either we change version to old one or use async and await
    await mongoose.connect(mongoURI)
    console.log("connected to mongo");
}
module.exports= connectToMongo;
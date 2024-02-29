import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("connect to Mogodb")
        
    } catch (error) {
        console.log(`Error in Mongodb ${error}`)
    }
}

export default connectDB;


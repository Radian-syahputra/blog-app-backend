import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`Success Connect Database`)
    } catch (error) {
        console.log(`Connect Database Failed : ${error}`)
    }
}

export default connectDB
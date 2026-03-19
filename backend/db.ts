import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

async function dbConnect() {
    try {
        await mongoose.connect(process.env.URL);
        console.log("Db connected successfully!");
    } catch (err) {
        console.log("Db connection failed!!", err);
    }
}

export default dbConnect;
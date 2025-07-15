import mongoose from "mongoose";
import { DB_NAME } from "../constant/index.js";

const DBConnectionHandler = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}/${DB_NAME}`);
    console.log("!!! DB CONNECTED !!!");
  } catch (error) {
    console.log("DB Connection Error:", error);
    process.exit(1);
  }
};

export default DBConnectionHandler;

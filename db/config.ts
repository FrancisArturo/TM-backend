import { connect } from "mongoose"
import { DB_URL } from "../config/config.ts";



export const configConnection = {
    url: DB_URL as string,
    options: {
        dbName: "taskManager", 
    },
};

export const connectDB = async() => {
    try {
        await connect(configConnection.url, configConnection.options);
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
        throw new Error("Error connecting to Database")
    }
};
import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

const connection = async () => {
    const mongodb = await MongoMemoryServer.create();
    const getUri = mongodb.getUri();

    mongoose.set('strictQuery', true);
    // const database = await mongoose.connect(getUri);
    const database = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connection established");
    return database;
}

export default connection; 
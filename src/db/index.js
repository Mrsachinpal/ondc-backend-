import Sequelize from 'sequelize';
import { config } from '../config/index.js';
import mongoose from 'mongoose';
const { dburl, mongo_url } = config;
export const sequelize = new Sequelize(dburl, {
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
    }
});

sequelize.options.logging = false;

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("database connected successfully");
    } catch (error) {
        console.log("Unable to connect to the db:", error);
    }
}

export const connectMongodb = async () => {
    try {
        await mongoose.connect(mongo_url);
        console.log("Mongo db connected successfully !");
    } catch (error) {
        console.log("Mongo db is not connected !", error);
    }
}


import express from "express";
import cors from 'cors';
import { Signuprouter } from "../routes/Signup.js";
import { Userrouter } from "../routes/User.js";
import {Bmrrouter} from "../routes/Bmr.js";
import { Levelrouter } from "../routes/Level.js";
import {Adminrouter} from "../routes/Admin.js";
import { Productrouter } from "../routes/Product.js";
import { Workoutrouter } from "../routes/Workout.js";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();



const DB = process.env.DB;
const app = express();
const PORT = 4000;


app.use(cors({
  origin: ['https://fitness365.vercel.app', 'http://localhost:3000' , 'https://evolve365.vercel.app'],  // Allow specific origins
  credentials: true
}));



app.use(express.json());
app.use('/api', Signuprouter);
app.use('/api', Userrouter);
app.use('/api', Bmrrouter);
app.use('/api', Levelrouter);
app.use('/api', Adminrouter);
app.use('/api', Productrouter);
app.use('/api', Workoutrouter);

app.use(express.static('public'));



// app.use(cookieParser());

mongoose.connect(DB)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        console.log("Connected to database")
    })                                                              
    .catch(error => {
        console.error("Error connecting to the database:", error);
    });
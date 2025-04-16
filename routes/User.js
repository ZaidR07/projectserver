import express from "express";
import { SignupModel } from '../models/Signup.js';
import { UserModel } from '../models/User.js';

const Userrouter = express.Router();

Userrouter.post('/Userinfo', async (req, res) => {
    try {
        const { email, gender, age, height, weight, waist, diet, activity, experience } = req.body;


        const newUser = new UserModel({
            email,
            gender,
            age,
            height,
            weight,
            waist,
            diet,
            activity,
            experience
        });

        // Save the new user to the database
        await newUser.save();

        return res.status(200).json({
            status: true,
            message: "User info updated Successfully",
            user: {
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error in updating", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

Userrouter.post('/profileupdate', async (req, res) => {
    try {
        const { email, age, height, weight, waist, diet, activity, experience } = req.body;

        const existinguser = await UserModel.findOne({ email: email });

        if (!existinguser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user properties
        if (age) existinguser.age = age;
        if (height) existinguser.height = height;
        if (weight) existinguser.weight = weight;
        if (waist) existinguser.waist = waist;
        if (diet) existinguser.diet = diet;
        if (activity) existinguser.activity = activity;
        if (experience) existinguser.experience = experience;

        // Save the updated user
        await existinguser.save();

        return res.json({
            message: "Product Updated Successfully",
            status: true
        });

    } catch (error) {
        console.error("Error in updating", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export { Userrouter };

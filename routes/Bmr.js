import express from "express";
import { UserModel } from '../models/User.js';

const Bmrrouter = express.Router();

Bmrrouter.post('/Bmr', async (req, res) => {
    const { email } = req.body;
    console.log(email);

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const { height, weight, age, gender, activity } = user;
        console.log(activity);

        let calories = 0;
        let BMR = 0;

        if (gender == "male") {
            BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            if (activity == "Sedentary") {
                calories = BMR * 1.2;
            }
            if (activity == "Light-Activity") {
                calories = BMR * 1.375;
            }

            if (activity == "Moderately-Active") {
                calories = BMR * 1.55;
            }
            if (activity == "Highly-Active") {
                calories = BMR * 1.725;
                console.log(BMR);
                console.log("testing");

            }
        } 
        else if (gender === "Female") {
            BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            if (activity == "Sedentary") {
                calories = BMR * 1.2;
            }
            if (activity == "Light-Activity") {
                calories = BMR * 1.375;
            }

            if (activity == "Moderately-Active") {
                calories = BMR * 1.55;
            }
            if (activity == "Highly-Active") {
                calories = BMR * 1.725;

            }

        }
        console.log("BMR:", BMR);
        console.log("Calories:", calories);
        res.json({ calories });
    } catch (error) {
        console.error("Error retrieving user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export { Bmrrouter };

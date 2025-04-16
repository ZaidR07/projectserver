import express from 'express';
import bcrypt from 'bcrypt';
import { SignupModel } from '../models/Signup.js';
import jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';
import nodemailer from 'nodemailer';
import { AdminModel } from '../models/Admin.js';



const Signuprouter = express.Router();
let globalOtp = null;

Signuprouter.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    
    try {
        // Checking if the user already exists
        const User = await SignupModel.findOne({ email });
        if (User) {
            return res.json({ message: "User already exists" });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating a new user
        const newUser = new SignupModel({
            username,
            email,
            password: hashedPassword
        });

        // Saving the new user
        await newUser.save();

        return res.json({
            status: true,
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email

            }
        });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

Signuprouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user is an admin
        const admin = await AdminModel.findOne({ email });
        if (admin && admin.password === password) {
            // If admin is authenticated, send admin response
            return res.json({
                admin: true,
                email: admin.email,
                password: admin.password,
            });
        }

        // If the provided credentials do not belong to an admin,
        // proceed to regular user authentication
        const user = await SignupModel.findOne({ email });
        if (!user) {
            return res.json({
                message: "User is not registered",
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.json({
                message: "Password is incorrect",
                status : true,
            });
        }

        const username = user.username;
        const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 360000 });

        return res.json({
            message: "Login Successful",
            userlogin: true,
            user: {
                email: email,
                username: username
            }
        });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


Signuprouter.post('/Forgot_password', async (req, res) => {
    const { email } = req.body;
    const otp = randomInt(100000, 1000000)

    try {
        const user = await SignupModel.findOne({ email });
        if (!user) {
            return res.json({ message: "Invalid User" })
        }


        user.resetPasswordOTP = {
            otp,
            timestamp: Date.now()
        };
        await user.save();


        setTimeout(async () => {
            user.resetPasswordOTP = undefined;
            await user.save();
            console.log("OTP expired for user:", user.email);
        }, 60000);

        globalOtp = otp;


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'zaidstudy342@gmail.com',
                pass: 'uist aurq lwod izrb',
            }
        });

        var mailOptions = {
            from: 'zaidstudy342@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: `Your OTP to reset password is ${otp}`,
        };


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ status: true, message: "Email Sent Succesfully" })
            }
        });
    }
    catch (err) {
        console.log(err);
    }



})
Signuprouter.post('/SetNewpassword', async (req, res) => {
    const { email, otp, newpass } = req.body;
    if (otp == globalOtp) {
        try {

            const user = await SignupModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.password = await bcrypt.hash(newpass, 10);

            await user.save();

            return res.json({ message: "Password updated successfully" });
        }
        catch (error) {
            console.error("Error updating password:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    else {
        return res.json({ message: "Invalid OTP" });
    }
});

export { Signuprouter };



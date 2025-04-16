import express from "express";
import { UserModel } from '../models/User.js';

const Levelrouter = express.Router();

Levelrouter.post('/Level', async (req,res) =>{
    const {email} = req.body;
    console.log(`Coming from workout = ${email}`);
    try {
        const user = await UserModel.findOne({email});

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const Level = user.experience;
        res.json({
            level : Level,
            message : " Userfound ",
            status : true,
        })

    } catch (error) {
        
    }
})

export {Levelrouter};
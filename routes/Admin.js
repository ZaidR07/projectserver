import express from "express";
import { UserModel } from "../models/User.js";
import { ProductModel } from "../models/Product.js";
const Adminrouter = express.Router();

Adminrouter.get("/Admin", async (req, res) => {
    try {
        const users = await UserModel.find();
        const products = await ProductModel.find();

        const totalusers = users.length;
        const totalproducts = products.length;

        res.json({
            totalusers, totalproducts, status: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

Adminrouter.get("/Customerget", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

Adminrouter.post("/profileget", async (req, res) => {
    const { email } = req.body;
    try {
        const users = await UserModel.find({ email: email });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




export { Adminrouter };


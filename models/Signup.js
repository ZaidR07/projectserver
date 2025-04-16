import mongoose from "mongoose";

const SignupSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const SignupModel = mongoose.model("Signup", SignupSchema);

export {SignupModel};

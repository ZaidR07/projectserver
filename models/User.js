import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { type: String,  },
    gender: { type: String,  },
    age: { type: String,  },
    height: { type: String,  },
    weight: { type: String,  },
    waist: { type: String,  },
    diet: { type: String,  },
    activity: { type: String,  },
    experience: { type: String,  }
    



});

const UserModel = mongoose.model("User", UserSchema);

export {UserModel};

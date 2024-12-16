import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    list: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "list",
        },
    ],
}); 

export default mongoose.model("User", userSchema);

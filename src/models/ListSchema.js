import mongoose from "mongoose";

const Schema = mongoose.Schema;

const listSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        user: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "list",
            },
        ],
    },
    { timestamps: true }
);


export default mongoose.model("List", listSchema);
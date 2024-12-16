import { Router } from "express";
import express from 'express'
import userSchema from "../models/UserSchema.js";
import ListSchema from "../models/ListSchema.js";

const router = express.Router();

//create
router.post("/addTask", async (req, res) => {
    try {
        const { title, body, email } = req.body;
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            const list = new ListSchema({ title, body, user: existingUser });
            await list.save().then(() => res.status(200).json({ list }));
            existingUser.list.push(list);
            await existingUser.save();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// update
router.put("/updateTask/:id", async (req, res) => {
    try {
        const { title, body, email } = req.body;
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            const updatedTask = await ListSchema.findByIdAndUpdate(
                req.params.id,
                { title, body },
                { new: true }
            );

            if (updatedTask) {
                res.status(200).json({ message: "Task Updated", updatedTask });
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete
router.delete("/deleteTask/:id", async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await userSchema.findOneAndUpdate(
            { email }, 
            { $pull:{ list: req.params.id } }
        );
        if (existingUser) {
            const taskId = req.params.id;
            if (!taskId) {
                return res.status(400).json({ message: "Task ID is required" });
            }
            await ListSchema.findByIdAndDelete(taskId);
            res.status(200).json({ message: "Task Deleted" });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//getTask
router.get("/getTask/:id", async(req, res) => {
    const List = await ListSchema.find({ user:req.params.id });
    res.status(200).json({ List });
}) 

export default router;
import { Router } from "express";
import userSchema from "../models/UserSchema.js";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

//register
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userSchema({ email, username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User Created Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { email: user.email, password: user.password },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.status(200).json({ message: "Login Successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error lolll" });
    }
});

export default router;

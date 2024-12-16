import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/Database.js';
import router from './routes/Auth.js';
import listRoutes from "./routes/List.js";


const app = express();
dotenv.config()
connectDB();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send('hello');
});

app.use("/api/v1", router);
app.use("/api/v2", listRoutes);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
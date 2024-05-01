const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require(colors);
const userRoutes = require("./routes/userRoutes");

// connect to .env file
dotenv.config();

// connect to mongo db
connectDB();

// app API
const app = express();

// allow app API to take JSON data
app.use(express.json());

// app API GET to check if webserver is up
app.get("/", (req, res) => {
    res.send("API is Running Successfully");
});

/* app APIs to accomodate router / API endpoints */
// Registering new users and authenticating existing ones
app.use("/api/user", userRoutes);

// 


const PORT = process.env.PORT || 5000; // PORT set to 8000 from .env file, otherwise 5000

const express = require('express');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/ErrorMiddleware");
const userRoutes = require("./routes/userRoutes");
const colors = require("colors");

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

const PORT = process.env.PORT || 5000; // PORT set to 8000 from .env file, otherwise 5000

app.use(notFound);
app.use(errorHandler);

const server = app.listen(
    PORT,
    console.log(`Server started on PORT ${PORT}`.yellow.bold)
);
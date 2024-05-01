// User Class
const asyncHandler = require("express-async-handler");
const generateToken = require("../middleware/jwtAuthVerification");
const User = require("../models/userModel")

// Register user function, creates new unique users in DB
const registerUser = asyncHandler(async (req, res) => {
    // define request body params
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    // check for any matching emails in user db
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("There is already an account associated with this email.");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("User creation failure");
    }
});

// Authenticate a user login
const authUser = asyncHandler(async (req, res) => {
    // define request body params
    const { email, password } = req.body;

    // find the mongodb document with a matching email
    const user = await User.findOne({ email });

    // check to match email and password
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password. Please try again.");
    }

})

module.exports = { authUser, registerUser };
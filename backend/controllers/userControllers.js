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

// TODO: add functions for adding, editing, and removing entries into the entries array

// Create entry
const createEntry = asyncHandler(async (req, res) => {
    // define request body params
    const { entry_name, application_name, username, password } = req.body;
    const userId = req.params.userId;

    try {
        /* make sure entry_name is unique */
        // find users document in mongodb
        const user = await User.findById({ userId })

        if (!user) {
            res.status(404).json({ message: "User not found" });
            throw new Error("User not found.");
        }

        // Check if entry with the same name already exists
        const existingEntry = user.entries.find(entry => entry.entry_name === entry_name);

        if (existingEntry) {
            res.status(400).json({ message: "An entry with the same name already exists" });
            throw new Error("An entry with the same name already exists. Make sure your entry name is unique.");
        }

        // Create a new entry object
        const newEntry = { entry_name, application_name, username, password };

        // Append the new entry to the user's entries array
        user.entries.push(newEntry);

        // Save the updated user document
        await user.save();

        // Respond with success message
        res.status(201).json({ message: "Entry created and added to user's entries" });
    
    } catch (error) {
        // Handle errors
        console.error("Error creating entry:", error);
        res.status(500).json({ message: "Server error" });
        throw new Error("Error creating entry.");
    }
});

// Delete entry
const deleteEntry = asyncHandler(async (req, res) => {
    // Gather request parameter information
    const userId = req.params.userId;
    const entryId = req.params.entryId;

    try {
        // Find user document
        const user = await User.findById(userId);

        // Filter out the entry to delete from the entries array
        user.entries = user.entries.filter(entry => entry._id !== entryId);

        // Save the updated document
        await user.save();

        // Respond with success message
        res.status(201).json({ message: "Entry deleted from the user's entries" });
    
    } catch (error) {
        // Handle errors
        console.error("Error deleting entry:", error);
        res.status(500).json({ message: "Server error" });
        throw new Error("Error deleteing entry.");
    }
});

// Edit entry
const editEntry = asyncHandler(async (req, res) => {
    // Define and gather parameter information
    const { entry_name, application_name, username, password } = req.body;
    const userId = req.params.userId;
    const entryId = req.params.entryId;

    try {
        // Find user document
        const user = await User.findById(userId);

        // Find index of entry in the entries array
        const index = user.entries.findIndex(entry => entry._id === entryId);

        // Update the entry object
        user.entries[index] = updatedEntry;

        // Save the updated user document
        await user.save();

        // Respond with success message
        res.status(201).json({ message: "Entry edited successfully" })

    } catch (error) {
        // Handle errors
        console.error("Error editing entry:", error);
        res.status(500).json({ message: "Server error" });
        throw new Error("Error editing entry.");
    }
});

module.exports = { deleteEntry, createEntry, editEntry, authUser, registerUser };
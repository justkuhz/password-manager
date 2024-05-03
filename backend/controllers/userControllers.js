// User Class
const asyncHandler = require("express-async-handler");
const token = require("../middleware/JWTAuthVerification");
const User = require("../models/userModel");
const passwordControl = require("../controllers/PasswordControllers");
const inputControl = require("../controllers/InputControllers");

// Register user function, creates new unique users in DB
const registerUser = asyncHandler(async (req, res) => {
    // define request body params
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    // Sanitize inputs
    name = inputControl.sanitizeInput(name);
    email = inputControl.sanitizeInput(email);
    password = inputControl.sanitizeInput(password);

    // validate email address
    if (inputControl.validateEmail(email) === false) {
        res.status(400).json({ message: "Please enter a valid email."});
        throw new Error("Please enter a valid email.")
    }

    // deny creation by throwing error if password is not strong enough
    let passwordEval = passwordControl.getPasswordStrength(password);
    if (passwordEval.allow === false) {
        res.status(400);
        throw new Error(passwordEval.suggestions[0]);
    };

    try {
        // check for any matching emails in user db
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: "There is already an account associated with this email." });
            throw new Error("There is already an account associated with this email.");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
        throw new Error(error.message);
    }

    try {
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
                token: token.generateToken(user._id),
            })
        } else {
            res.status(400).json({ message: "User creation failure" });
            throw new Error("User creation failure");
        }
    } catch (error) {
        res.status(400).json({ message: "Failed to create new user -> " + error.message });
        throw new Error("Failed to create new user: " + error.message);
    }
});

// Authenticate a user login
const authUser = asyncHandler(async (req, res) => {
    // define request body params
    let { email, password } = req.body;

    // Sanitize inputs
    email = inputControl.sanitizeInput(email);
    password = inputControl.sanitizeInput(password);

    // find the mongodb document with a matching email
    const user = await User.findOne({ email });

    // check to match email and password
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token.generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password. Please try again.");
    }

})

// Get entries
const getEntries = asyncHandler(async (req, res) => {
    // define user id from request params
    const userId = req.params.userId;

    try {
        // get user document from mongodb
        const user = await User.findById({ userId });

        if (!user) {
            res.status(404).json({ message: "User not found "});
            throw new Error("User not found.");
        }

        // Send entries array (property) from user document
        const entries = user.entries;
        res.send(entries);

    } catch (error) {
        // Handle errors
        console.error("Error retrieving entries:", error);
        res.status(500).json({ message: "Server error" });
        throw new Error("Error retrieving entries.");
    }
});

// Create entry
const createEntry = asyncHandler(async (req, res) => {
    // define request body params
    let { entry_name, application_name, username, password } = req.body;
    const userId = req.params.userId;

    // Sanitize inputs
    entry_name = inputControl.sanitizeInput(entry_name);
    application_name = inputControl.sanitizeInput(application_name);
    email = inputControl.sanitizeInput(email);
    password = inputControl.sanitizeInput(password);

    try {
        /* make sure entry_name is unique */
        // find users document in mongodb
        const user = await User.findById({ userId });

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
    let { entry_name, application_name, username, password } = req.body;
    const userId = req.params.userId;
    const entryId = req.params.entryId;

    // Sanitize inputs
    entry_name = inputControl.sanitizeInput(entry_name);
    application_name = inputControl.sanitizeInput(application_name);
    email = inputControl.sanitizeInput(email);
    password = inputControl.sanitizeInput(password);

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

module.exports = { getEntries, deleteEntry, createEntry, editEntry, authUser, registerUser };
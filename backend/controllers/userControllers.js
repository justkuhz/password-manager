// User Class
const asyncHandler = require("express-async-handler");
const token = require("../middleware/JWTAuthVerification");
const User = require("../models/userModel");
const passwordControl = require("../controllers/PasswordControllers");
const inputControl = require("../controllers/InputControllers");
const cryptoHandler = require("../middleware/cryptoMiddleware");

// Register user function, creates new unique users in DB
const registerUser = asyncHandler(async (req, res) => {
    // define request body params
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        throw new Error("Please enter all the fields.");
    }

    // Sanitize inputs
    let sanitizedName = inputControl.sanitizeInput(name);
    let sanitizedEmail = inputControl.sanitizeInput(email);
    let sanitizedPassword = inputControl.sanitizeInput(password);

    // validate email address
    if (inputControl.validateEmail(sanitizedEmail) === false) {
        throw new Error("Please enter a valid email.")
    }

    // deny creation by throwing error if password is not strong enough
    let passwordEval = passwordControl.getPasswordStrength(sanitizedPassword);
    if (passwordEval.allow === false) {
        res.status(400);
        throw new Error(passwordEval.suggestions[0]);
    };

    User.findOne({ email: sanitizedEmail })
    .then(userExists => {
        if (userExists) {
            throw new Error("There is already an account associated with this email.");
        }
        return User.create({
            name: sanitizedName,
            email: sanitizedEmail,
            password: sanitizedPassword,
        });
    })
    .then(user => {
        if (user) {
            const userData = { _id: user._id, name: user.name, email: user.email, token: token.generateToken(user._id), }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token.generateToken(user._id),
            })
        } else {
            throw new Error("User creation failure");
        }
    })
    .catch(error => {
        res.status(400).json({ 
            message: "Failed to create new user",
            cause: error.message });
    });
});

// Authenticate a user login
const authUser = asyncHandler(async (req, res) => {
    // define request body params
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all the fields." });
    }

    // Sanitize inputs
    let sanitizedEmail = inputControl.sanitizeInput(email);

    // find the mongodb document with a matching email
    try {
        const user = await User.findOne({ email: sanitizedEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password. Please try again." });
        }

        // Verify the password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password. Please try again." });
        }

        const userData = { _id: user._id, name: user.name, email: user.email, token: token.generateToken(user._id), };

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: token.generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Login Error",
            cause: error.message 
        });
    }
});

// Get entries
const getEntries = asyncHandler(async (req, res) => {
    try {
    // define user id from request params

    if (req.params.userID === null) {
        throw new Error("No userID found in parameter.");
    }

    const userId = req.params.userID;

    User.findById(userId)
        .then(user => {
            if (!user) {
                throw new Error("User not found.");
            }

            // Send entries array (property) from user document
            const entries = user.entries;
            res.send(entries);
        })
        .catch(error => {
            // Handle errors
            console.error("Error retrieving entries:", error);
            throw new Error(error.message);
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Server error",
            cause: error.message
        });
    }
});

// Create entry
const createEntry = asyncHandler(async (req, res) => {
    try {

    // define request body params
    let { entry_name, application_name, username, entry_password } = req.body;
    const userId = req.body._id;

    // Sanitize inputs
    entry_name = inputControl.sanitizeInput(entry_name);
    application_name = inputControl.sanitizeInput(application_name);
    username = inputControl.sanitizeInput(username);
    entry_password = inputControl.sanitizeInput(entry_password);

    User.findById(userId)
        .then(user => {
            if (!user) {
                throw new Error("User not found.");
            }

            // Check if entry with the same name already exists
            const existingEntry = user.entries.find(entry => entry.entry_name === entry_name);

            if (existingEntry) {
                throw new Error("An entry with the same name already exists. Make sure your entry name is unique.");
            }

            entry_password = cryptoHandler.encrypt(entry_password);

            // Create a new entry object
            const newEntry = { entry_name, application_name, username, entry_password };

            // Append the new entry to the user's entries array
            user.entries.push(newEntry);

            // Save the updated user document
            return user.save().then(() => {
                // Respond with success message
                res.status(201).json({ 
                    message: "Entry created and added to user's entries",
                    userId: userId,
                    entry_name: entry_name,
                    application_name: application_name,
                    username: username,
                    entry_password: entry_password,
                });
            });
        })
        .catch(error => {
            // Handle errors
            console.error("Error creating entry:", error);
            res.status(500).json({ 
                message: "Server Error",
                cause: error.message
            });
        });
    } catch (error) {
        console.error("Error deleting entry:", error);
            res.status(500).json({ 
                message: "Server error",
                cause: error.message
            });
    }
});

// Delete entry
const deleteEntry = asyncHandler(async (req, res) => {
    try {

    // Gather request parameter information
    const userId = req.body._id;
    const { entryId } = req.body;

    let initialEntryCount;

    User.findById(userId)
        .then(user => {
            if (!user) {
                throw new Error("User data not found." );
            }

            // Store the initial size of user entries array
            initialEntryCount = user.entries.length;

            // Filter out the entry to delete from the entries array
            user.entries = user.entries.filter(entry => entry._id.toString() !== entryId);

            // Save the updated document
            return user.save();
        })
        .then(updatedUser => {
            // Check if entry was successfully deleted
            const finalEntryCount = updatedUser.entries.length;
            const deletionSuccessful = initialEntryCount > finalEntryCount;

            // Respond with appropriate message
            if (deletionSuccessful) {
                res.status(201).json({ 
                    message: "Entry successfully deleted",
                    userId: userId,
                    entryId: entryId,
                });
            } else {
                res.status(404).json({ 
                    message: "Entry not found",
                    userId: userId,
                    entryId: entryId,
                });
            }
        })
        .catch(error => {
            // Handle errors
            console.error("Error deleting entry:", error);
            res.status(500).json({ 
                message: "Server error",
                cause: error.message
            });
        });
    } catch (error) {
        console.error("Error deleting entry:", error);
            res.status(500).json({ 
                message: "Server error",
                cause: error.message
            });
    }
});

// Edit entry
const editEntry = asyncHandler(async (req, res) => {
    try {
        // Define and gather parameter information
        let { entry_name, application_name, username, entry_password } = req.body;
        const userId = req.body._id;
        const { entryId } = req.body;

        // Sanitize inputs
        entry_name = inputControl.sanitizeInput(entry_name);
        application_name = inputControl.sanitizeInput(application_name);
        username = inputControl.sanitizeInput(username);
        entry_password = inputControl.sanitizeInput(entry_password);

        // Find user document
        User.findById(userId)
            .then(user => {
                if (!user) {
                    throw new Error("User not found.");
                }

                // Find index of entry in the entries array
                const index = user.entries.findIndex(entry => entry._id.toString() === entryId);

                if (index === -1) {
                    throw new Error("Entry not found.");
                }

                // Update the entry object
                user.entries[index].entry_name = entry_name;
                user.entries[index].application_name = application_name;
                user.entries[index].username = username;
                user.entries[index].entry_password = entry_password;
                
                // Save the updated user document
                return user.save();
            })
            .then(() => {
                // Respond with success message
                res.status(201).json({ message: "Entry edited successfully" });
            })
            .catch(error => {
                // Handle errors
                console.error("Error editing entry:", error);
                res.status(500).json({ 
                    message: "Server error",
                    cause: error.message 
                });
            });

    } catch (error) {
        // Handle errors
        console.error("Error editing entry: ", error.message);
        res.status(500).json({ 
            message: "Server error",
            cause: error.message
        });
    }
});

// Decrypt password
const decryptPassword = asyncHandler(async (req, res) => {
    try {
        const { cipher } = req.body;

        const cleartext = cryptoHandler.decrypt(cipher);

        res.status(200).json({ cleartext });

    } catch (error) {
        console.error("Error decrypting: ", error.message);
        res.status(500).json({
            message: "Server error",
            cause: error.message
        });
    }
});


module.exports = { decryptPassword, getEntries, deleteEntry, createEntry, editEntry, authUser, registerUser };
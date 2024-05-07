const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const dotenv = require('dotenv');

dotenv.config();

// Call this when a user logs in
const generateToken = (id) => {

    // Sign the JWT with the secret key
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '24h' }); 
}


const verifyToken = asyncHandler(async (req, res, next) => {
    let token;

    if (
        // req sends token in the header, we use the bearer token
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Verify the token using the secret key
            token = req.headers.authorization.split(" ")[1];

            // devode token id and verify through jwt package
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // we find the user in the db and return it without the password
            req.user = await User.findById(decoded.id).select("-password");
            next();

        } catch (error) {
            // If verification fails (token expired, invalid signature, etc.), throw an error
            res.status(401);
            throw new Error('Invalid token. Not authorized.'); 
        }
    }

    // if no token found
    if (!token) {
        res.status(401);
        throw new Error("No token found. Not authorized.")
    }
});

module.exports = { verifyToken, generateToken };
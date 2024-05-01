// API endpoints for creating user model

const express = require('express');
const { verifyToken } = require('../middleware/jwtAuthVerification');
const { registerUser, authUser } = require("../controllers/userControllers")


// router API endpoint
const router = express.Router();

// POST for registering a new user
router.route('/').post(registerUser);

// POST for authenticating a login attempt
router.route('/').post(authUser);

module.exports = router;
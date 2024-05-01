// API endpoints for creating user model

const express = require('express');
const { verifyToken } = require('../middleware/jwtAuthVerification');
const { deleteEntry, createEntry, editEntry, authUser, registerUser } = require("../controllers/userControllers");


// router API endpoint
const router = express.Router();

// POST for registering a new user
router.route('/').post(registerUser);

// POST for authenticating a login attempt
router.route('/login').post(authUser);

// POST for creating and appending an entry
router.route('/createEntry').post(verifyToken, createEntry);

// DELETE for deleting an entry
router.route('/deleteEntry').delete(verifyToken, deleteEntry);

// PUT for editing an entry
router.route('/editEntry').put(verifyToken, editEntry);

module.exports = router;
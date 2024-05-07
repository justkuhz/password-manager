// API endpoints for creating user model

const express = require('express');
const { verifyToken } = require('../middleware/JWTAuthVerification');
const { 
    deleteEntry, 
    createEntry, 
    editEntry, 
    authUser, 
    registerUser, 
    getEntries, 
    decryptPassword} = require("../controllers/UserControllers");

// router API endpoint
const router = express.Router();

// POST for registering a new user
router.route('/').post(registerUser);

// POST for authenticating a login attempt
router.route('/login').post(authUser);

// GET for getting the entries table
router.route('/getEntries/:userID').get(verifyToken, getEntries);

// POST for creating and appending an entry
router.route('/createEntry').put(verifyToken, createEntry);

// DELETE for deleting an entry
router.route('/deleteEntry').delete(verifyToken, deleteEntry);

// PUT for editing an entry
router.route('/editEntry').post(verifyToken, editEntry);

// GET for decrypting password
router.route('/decrypt').post(verifyToken, decryptPassword)

module.exports = router;
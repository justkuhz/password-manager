// API endpoints for creating user model

const express = require('express');
const { verifyToken } = require('../middleware/JWTAuthVerification');
const { deleteEntry, createEntry, editEntry, authUser, registerUser, getEntries} = require("../controllers/UserControllers");

// router API endpoint
const router = express.Router();

// POST for registering a new user
router.route('/').post(registerUser);

// POST for authenticating a login attempt
router.route('/login').post(authUser);

// UNCOMMENT ONCE DONE DEBUGGING BACKEND
// GET for getting the entries table
// router.route('/getEntries').get(verifyToken, getEntries);
router.route('/getEntries').get(getEntries);

// // POST for creating and appending an entry
// router.route('/createEntry').put(verifyToken, createEntry);
router.route('/createEntry').post(createEntry);

// // DELETE for deleting an entry
// router.route('/deleteEntry').delete(verifyToken, deleteEntry);
router.route('/deleteEntry').delete(deleteEntry);

// // PUT for editing an entry
// router.route('/editEntry').post(verifyToken, editEntry);
router.route('/editEntry').post(editEntry);

module.exports = router;
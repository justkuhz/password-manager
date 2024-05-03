// Function to Sanitize inputs on web app
const sanitizeHtml = require('sanitize-html');

// Define a function to sanitize user input
function sanitizeInput(input) {
    // Use sanitize-html to remove any potentially harmful HTML or JavaScript code
    return sanitizeHtml(input);
}

// Validate user input is an email address
function validateEmail(input) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the input email against the regex
    return emailRegex.test(input);
}

module.exports = { sanitizeInput, validateEmail };
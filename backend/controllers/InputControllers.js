// Function to Sanitize inputs on web app
const sanitizeHtml = require('sanitize-html');

// Define a function to sanitize user input
function sanitizeInput(input) {
    // Use sanitize-html to remove any potentially harmful HTML or JavaScript code
    return sanitizeHtml(input);
}

module.exports = { sanitizeInput };
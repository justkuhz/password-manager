const crypto = require('crypto');

function hashPassword(password, salt) {
    // If no salt provided, generate a random salt
    if (!salt) {
        salt = crypto.randomBytes(16).toString('hex'); // 16 bytes = 128 bits
    }

    // Combine password and salt
    const saltedPassword = password + salt;

    // Hash the salted password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');

    // Return hashed password and salt
    return {
        hashedPassword: hashedPassword,
        salt: salt
    };
}

/* Example usage
const password = "mySecurePassword123";
const { hashedPassword, salt } = hashPassword(password);
console.log("Hashed Password:", hashedPassword);
console.log("Salt:", salt);
*/

// This function takes the user's input password, the stored hashed password, and the stored salt
// It returns true if the passwords match, false otherwise
function authenticateUser(inputPassword, storedHashedPassword, storedSalt) {
    // Combine input password with stored salt
    const saltedPassword = inputPassword + storedSalt;

    // Hash the salted password using SHA-256
    const hashedPassword = crypto.createHash('sha256').update(saltedPassword).digest('hex');

    // Compare the computed hash with the stored hash
    return hashedPassword === storedHashedPassword;
}

/* Example usage for authentication
const storedHashedPassword = "c10b7a9cf24b1830a1a2029b394e818ce48c7454e40c12df7e0cb46f36a1e0c4";
const storedSalt = "4ea964a84cd064b60614ed09c66c3a92";
const inputPassword = "mySecurePassword123";

if (authenticateUser(inputPassword, storedHashedPassword, storedSalt)) {
    console.log("Authentication successful! User logged in.");
} else {
    console.log("Authentication failed. Incorrect password.");
}
*/
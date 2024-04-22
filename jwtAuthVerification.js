
const jwt = require('jsonwebtoken');

// Secret key used to sign the JWT
const secretKey = crypto.randomBytes(32).toString('hex');

// Call this when a user logs in
function createToken(user) {
    const payload = {
        userId: user.id,
        email: user.email,
        password: user.password 
    };

    // Sign the JWT with the secret key
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); 

    return token;
}

/* Example usage after a user logs in
const user = {
    id: 123,
    email: 'user@example.com',
};

// We will pull user from database instead not creating like this

const token = createToken(user);
console.log("JWT:", token);
*/



function verifyToken(token) {
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, secretKey);

        // If the token is valid, return the decoded payload
        return decoded;
    } catch (error) {
        // If verification fails (token expired, invalid signature, etc.), throw an error
        throw new Error('Invalid token'); // This shoudl kick them back to login screen
    }
}
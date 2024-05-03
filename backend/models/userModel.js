// User Model and Functions
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const crypto = require('crypto');
const dotenv = require("dotenv");

dotenv.config();

// entry schema
const entrySchema = mongoose.Schema(
    {
        // entry name
        entry_name: { type: String, required: true },
        // app name
        application_name: { type: String, required: true },
        // app login username
        username: { type: String, required: true },
        // app login password
        password: { type: String, required: true }
    },
    { timestamps: true }
);

// user schema
const userSchema = mongoose.Schema(
    {
        // name
        name: { type: String, required: true },
        // email
        email: { type: String, required: true, unique: true },
        // password
        password: { type: String, required: true },
        entries: [entrySchema],
    },
    { timestameps: true }
);

// we hash the password input with bcrypt hash and compare
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
}

// before saving user data into database, encrypt the password
userSchema.pre('save', async function (next) {
    if (!this.isModified()) {
        next();
    }

    // 10 rounds used to generate salt
    const salt = await bcryptjs.genSalt(10);
    // hashing password using bcrypt hashing algorithm with password + salt combo
    this.password = await bcryptjs.hash(this.password, salt);
});

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, secretKey);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, secretKey);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// before saving entry data into user entries we encrypt password with aes
entrySchema.pre('save', async function (next) {
    if (!this.isModified()) {
        next();
    }

    this.password = encrypt(this.password);
    next();
});

// defining and exporting user model
const User = mongoose.model("User", userSchema);
module.exports = User, { decrypt };
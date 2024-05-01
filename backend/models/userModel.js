// User Model and Functions

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        // name
        name: { type: String, required: true },
        // email
        email: { type: String, required: true, unique: true },
        // password
        password: { type: String, required: true },
        },
    { timestameps: true }
);

// we encrypt the password input with bcrypt hash and compare
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
})

// defining and exporting user model
const User = mongoose.model("User", userSchema);
module.exports = User;
// Password Functions

// Generate a secure password
function generatePassword() {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercaseChars + uppercaseChars + specialChars;

    let password = '';

    // Add at least one lowercase letter
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));

    // Add at least one uppercase letter
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));

    // Add at least one special character
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Add remaining characters
    for (let i = 0; i < 13; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the characters to randomize the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');

    return password;
}

// Validate password strength
function getPasswordStrength(password) {
    // Define regex patterns for different criteria
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
    const lengthRegex = /^.{12,}$/;

    // Check if the password meets each criteria
    const hasLowercase = lowercaseRegex.test(password);
    const hasUppercase = uppercaseRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
    const hasValidLength = lengthRegex.test(password);

    // Calculate strength based on criteria met
    let strength = 0;
    if (hasLowercase) strength++;
    if (hasUppercase) strength++;
    if (hasSpecialChar) strength++;
    if (hasValidLength) strength++;

    // Return strength as a string value
    let strengthString = "";
    if (strength <= 1) {
        strengthString = "weak";
    } else if (strength === 2) {
        strengthString = "medium";
    } else if (strength === 3) {
        strengthString = "strong";
    } else if (strength === 4) {
        strengthString = "very strong";
    } 

    // Suggestions for improving password strength
    let suggestions = [];
    if (!hasLowercase) suggestions.push("Add at least one lowercase letter.");
    if (!hasUppercase) suggestions.push("Add at least one uppercase letter.");
    if (!hasSpecialChar) suggestions.push("Add at least one special character.");
    if (!hasValidLength) suggestions.push("Ensure password is at least 12 characters long.");

    // Allow/Disallow use of password
    let allow = false;
    if (strength === 4) {
        allow = true;
    }

    // Return strength, suggestions, and allow
    return {
        strength_string: strengthString,
        strength_value: strength,
        suggestions: suggestions,
        allow: allow,
    };
}

module.exports = { generatePassword, getPasswordStrength };
const cryptojs = require('crypto-js');
const dotenv = require('dotenv');

// pull key from .env file
dotenv.config();

// decrypt a ciper user secret key
const decrypt = (cipher) => {
    const bytes = cryptojs.AES.decrypt(cipher, process.env.AES_SECRET_KEY);
    return bytes.toString(cryptojs.enc.Latin1);
}

// encrypt a plain text user secret key
const encrypt = (password) => {
    return cryptojs.AES.encrypt(password, process.env.AES_SECRET_KEY).toString();
}

module.exports = { decrypt, encrypt };
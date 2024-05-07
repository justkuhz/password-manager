const cryptojs = require('crypto-js');
const dotenv = require('dotenv');

dotenv.config();

const decrypt = (cipher) => {
    const bytes = cryptojs.AES.decrypt(cipher, process.env.AES_SECRET_KEY);
    return bytes.toString(cryptojs.enc.Latin1);
}

const encrypt = (password) => {
    return cryptojs.AES.encrypt(password, process.env.AES_SECRET_KEY).toString();
}

module.exports = { decrypt, encrypt };
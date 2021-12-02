const crypto = require('crypto');

// const hash = crypto.createHash('sha512');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function (password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    const hashedPassword = hash.digest('hex');
    return {
        salt: salt,
        hashedPassword: hashedPassword,
    };
};

const saltHashPassword = (userPassword) => {
    const salt = genRandomString(16);
    /** Gives us salt of length 16 */
    return sha512(userPassword, salt);
}

const validatePassword = (userPassword, userSalt, userHashedPassword) => {

    const passwordData = sha512(userPassword, userSalt);
    return passwordData.hashedPassword === userHashedPassword;

}

module.exports = {
    saltHashPassword,
    validatePassword,
}
const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, 'SECRET_KEY', { expiresIn: '7d' });

module.exports = generateToken;

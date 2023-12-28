const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, 'dev__secret', { expiresIn: '7d' });

module.exports = generateToken;

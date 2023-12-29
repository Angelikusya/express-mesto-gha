const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;
const {
  unauthorizedError,
  defaultError,
} = require('../utils/errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(unauthorizedError.status)
      .send({ message: unauthorizedError.message });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.message === 'NotAutanticate' && 'JsonWebTokenError') {
      return res
        .status(unauthorizedError.status)
        .send({ message: unauthorizedError.message });
    }
    return res
      .status(defaultError.status)
      .send({ message: defaultError.message });
  }
  req.user = payload;
  return next();
};

module.exports = auth;

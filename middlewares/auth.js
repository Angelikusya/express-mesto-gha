const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'С токеном что-то не то' });
    }
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
  if (!payload.userId) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};

module.exports = auth;

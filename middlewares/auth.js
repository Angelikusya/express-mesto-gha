const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.message === 'NotAutanticate') {
      return res
        .status(401)
        .send({ message: 'Неправильный email или пароль' });
    }
    if (error.message === 'JsonWebTokenError') {
      return res
        .status(401)
        .send({ message: 'С токеном что-то не то' });
    }
    return res
      .status(500)
      .send({ message: 'Сервер отвалился' });
  }
  req.user = payload;
  return next();
};

module.exports = auth;

const jwt = require('jsonwebtoken');

// const devsecret = 'dev__secret';

const auth = (req, res, next) => {
  let payload;
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Error('NotAuthorized'));
  }
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, 'dev__secret');
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

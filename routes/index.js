const { Router } = require('express');
const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const { login, createUser } = require('../controllers/users');
const NotFoundedError = require('../errors/NotFoundedError');
const {
  validateUserAuthentication,
  validateUserInfo,
} = require('../middlewares/userValidation');

const auth = require('../middlewares/auth');

const router = Router();
router.post('/signup', validateUserInfo, createUser);
router.post('/signin', validateUserAuthentication, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.all('/*', (req, res, next) => {
  const error = new NotFoundedError('Ресурc не найден');
  next(error);
});

module.exports = { router };

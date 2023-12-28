const { Router } = require('express');
const { userRouter } = require('./users');
const { cardRouter } = require('./cards');
const { login, createUser } = require('../controllers/users');

const auth = require('../middlewares/auth');

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.post('/signup', createUser);
router.post('/signin', auth, login);

router.use(auth);

router.all('/*', (req, res) => {
  res.status(404).send({ message: 'Ресурc не найден' });
});

module.exports = { router };

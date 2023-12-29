const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const generateToken = require('../utils/jwt');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundedError = require('../errors/NotFoundedError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const STATUS_OK = 200;
const STATUS_CREATED = 201;

// получить всех пользователя
const getUsers = (req, res, next) => {
  userModel.find()
    .then((users) => res
      .status(STATUS_OK)
      .send(users))
    .catch(() => next());
};

const getUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundedError('Пользователь по указанному _id не найден'));
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при работе с пользователем'));
      }
      return next(error);
    });
};

// получить пользователя по определенному ID
const getUserByID = (req, res, next) => {
  const { idUser } = req.params;
  userModel.findById(idUser)
    .then((user) => {
      if (!user) {
        return next(new NotFoundedError('Пользователь по указанному _id не найден'));
      }
      return res
        .status(STATUS_OK)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при работе с пользователем'));
      }
      return next();
    });
};

// создать нового пользователя
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res
      .status(STATUS_CREATED)
      .send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при работе с пользователем'));
      } if (error.code === 11000) {
        return next(new ConflictError('Пользователь с такими данными уже существует'));
      }
      return next(error);
    });
};

// обновить информацию о пользователе
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      res
        .status(STATUS_OK)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при работе с пользователем'));
      } if (error.message === 'notValidId') {
        return next(new NotFoundedError('Пользователь по указанному _id не найден'));
      }
      return next(error);
    });
};

// обновить аватар пользователя
const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при работе с пользователем'));
      } if (error.message === 'notValidId') {
        return next(new NotFoundedError('Пользователь по указанному _id не найден'));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Необходима авторизация'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем
            return next(new UnauthorizedError('Необходима авторизация'));
          }
          const token = generateToken({ _id: user._id });
          res.cookie('token', token, { httpOnly: true });
          return res
            .status(STATUS_OK)
            .send({ token });
        });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getUser,
  getUsers,
  getUserByID,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};

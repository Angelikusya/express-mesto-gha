const bcrypt = require('bcrypt');
const userModel = require('../models/user');
const generateToken = require('../utils/jwt');

const {
  defaultError,
  userValidationError,
  userNotValidId,
} = require('../utils/errors');

const STATUS_OK = 200;
const STATUS_CREATED = 201;

// получить всех пользователя
const getUsers = (req, res) => {
  userModel.find()
    .then((users) => res
      .status(STATUS_OK)
      .send(users))
    .catch(() => res
      .status(defaultError.status)
      .send({ message: defaultError.message }));
};

const getUser = (req, res) => {
  userModel.findById(req.user.idUser)
    .then((user) => {
      if (!user) {
        return res
          .status(userNotValidId.status)
          .send({ message: userNotValidId.message });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(userValidationError.status)
          .send({ message: userValidationError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

// получить пользователя по определенному ID
const getUserByID = (req, res) => {
  const { idUser } = req.params;
  userModel.findById(idUser)
    .then((user) => {
      if (!user) {
        return res
          .status(userNotValidId.status)
          .send({ message: userNotValidId.message });
      }
      return res
        .status(STATUS_OK)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(userValidationError.status)
          .send({ message: userValidationError.message });
      } if (error.message === 'notValidId') {
        res
          .status(userNotValidId.status)
          .send({ message: userNotValidId.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

// создать нового пользователя
const createUser = (req, res) => {
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
        return res
          .status(userValidationError.status)
          .send({ message: userValidationError.message });
      } if (error.code === 11000) {
        return res
          .status(409)
          .send({ message: 'пользователь с таким email уже существует' });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

// обновить информацию о пользователе
const updateUserInfo = (req, res) => {
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
        return res
          .status(userValidationError.status)
          .send({ message: userValidationError.message });
      } if (error.message === 'notValidId') {
        res
          .status(userNotValidId.status)
          .send({ message: userNotValidId.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

// обновить аватар пользователя
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res
          .status(userValidationError.status)
          .send({ message: userValidationError.message });
      } if (error.message === 'notValidId') {
        res
          .status(userNotValidId.status)
          .send({ message: userNotValidId.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем
            return res.status(401).send({ message: 'Неправильные почта или пароль' });
          }
          const token = generateToken({ _id: user._id });
          res.cookie('token', token, { httpOnly: true });
          return res
            .status(STATUS_OK)
            .send({ token });
        });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
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

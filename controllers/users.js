const userModel = require('../models/user');
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
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => res
      .status(STATUS_CREATED)
      .send(user))
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

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};

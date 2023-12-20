const userModel = require('../models/user');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_CODE = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_SERVER_ERROR = 500;

// получить всех пользователя
const getUsers = (req, res) => {
  userModel.find()
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((error) => res.status(STATUS_SERVER_ERROR).send({ message: 'Пользователь не найден', error: error.message }));
};

// получить пользователя по определенному ID
const getUserByID = (req, res) => {
  const { idUser } = req.params;
  userModel.findById(idUser)
    .orFail(new Error('notValidId'))
    .then((user) => {
      if (!user) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Id пользователя не найдено' });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Id пользователя не найдено' });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: 'Ошибка на стороне севера', error: error.message });
    });
};

// создать нового пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Id новый пользователь не создан' });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: 'Ошибка на стороне севера', error: error.message });
    });
};

// обновить информацию о пользователе
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('notValidId'))
    .then((user) => res.status(STATUS_CREATED).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Информация о пользователе не обновлена', error: error.message });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: 'Ошибка на стороне севера', error: error.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  console.log(req.user);
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(new Error('notValidId'))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Информация о аватаре пользователя не обновлена', error: error.message });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: 'Ошибка на стороне севера', error: error.message });
    });
};

module.exports = {
  getUsers,
  getUserByID,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};

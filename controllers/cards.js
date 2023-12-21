const cardModel = require('../models/cards');
const {
  defaultError,
  cardValidationError,
  cardNotValidId,
} = require('../utils/errors');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_CODE = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_NO_CONTENT = 204;
const STATUS_SERVER_ERROR = 500;

// получить все карточки
const getCards = (req, res) => {
  cardModel.find()
    .then((cards) => res
      .status(STATUS_OK)
      .send(cards))
    .catch((error) => res
      .status(defaultError.status)
      .send({ message: defaultError.message}));
};

// создать новую карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res
      .status(STATUS_CREATED)
      .send({ _id: card._id }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(cardValidationError.status)
          .send({ message: cardValidationError.message });
      }
      return res
        .status(defaultError.status)
        .send({ message: defaultError.message});
    });
};

// удалить карточку
const deleteCard = (req, res) => {
  cardModel.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      res.status(STATUS_NO_CONTENT).send({ message: 'Карточка успешно удалена' });
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Карточка не удалена' });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: 'Ошибка на стороне сервера', error: error.message });
    });
};

// поставить лайк
const likeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError' ) {
        return res.status(ERROR_CODE).send({ message: 'Лайк не удален' });
      }
      return res
        .status(STATUS_SERVER_ERROR)
        .send({ message: 'Ошибка на стороне севера', error: error.message });
    });
};

// удалить лайк
const deleteLikeCard = (req, res) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(STATUS_CREATED).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Лайк не удален' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка на стороне севера', error: error.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};

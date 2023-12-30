const cardModel = require('../models/cards');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundedError = require('../errors/NotFoundedError');
const ForbiddenError = require('../errors/ForbiddenError');

const STATUS_OK = 200;
const STATUS_CREATED = 201;

// получить все карточки
const getCards = (req, res, next) => {
  cardModel.find()
    .then((cards) => res
      .status(STATUS_OK)
      .send(cards))
    .catch((error) => {
      next(error);
    });
};

// создать новую карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  cardModel.create({ name, link, owner: req.user._id })
    .then((card) => res
      .status(STATUS_CREATED)
      .send({ _id: card._id }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при работе с карточкой'));
      } else {
        next(error);
      }
    });
};

// удалить карточку
const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundedError('Карточка с указанным ID не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Карточка с указанным ID не найдена'));
      }
      return cardModel.deleteOne(card._id)
        .then(() => res
          .status(STATUS_OK)
          .send(card))
        .catch((err) => next(err));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при работе с карточкой'));
      }
      next(error);
    });
};

// поставить лайк
const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundedError('Карточка с указанным ID не найдена'));
        return;
      }
      res
        .status(STATUS_OK)
        .send({ card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при работе с карточкой'));
      }
      next(error);
    });
};

// удалить лайк
const deleteLikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundedError('Карточка с указанным ID не найдена'));
      }
      return res.status(STATUS_OK).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при работе с карточкой'));
      }
      next(error);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};

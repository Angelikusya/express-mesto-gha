const { Router } = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardId,
} = require('../middlewares/cardValidation');

const cardRouter = Router();

cardRouter.get('/', getCards); // возвращает все карточки
cardRouter.post('/', validateCard, createCard); // создаёт карточку
cardRouter.delete('/:cardId', validateCardId, deleteCard); // удаляет карточку по идентификатору
cardRouter.put('/:cardId/likes', validateCardId, likeCard); // поставить лайк карточке
cardRouter.delete('/:cardId/likes', validateCardId, deleteLikeCard); // убрать лайк с карточки

module.exports = { cardRouter };

const { Router } = require('express');
const { getCards, createCard, deleteCard, likeCard, deleteLikeCard } = require('../controllers/cards');

const cardRouter = Router();

cardRouter.get('/', getCards); //возвращает все карточки
cardRouter.post('/', createCard); //создаёт карточку
cardRouter.delete('/:cardId', deleteCard); // удаляет карточку по идентификатору
cardRouter.put('/:cardId/likes', likeCard); //поставить лайк карточке
cardRouter.delete('/:cardId/likes', deleteLikeCard); //убрать лайк с карточки

module.exports = { cardRouter };

// общая ошибка
const defaultError = {
  status: 500,
  message: 'Произошла ошибка на сервере',
};

// Ошибки роутинга пользователей
// роуты users, users/me, users/me/avatar
const userValidationError = {
  status: 400,
  message: 'Переданы некорректные данные при работе с пользователем',
};

/// роут users/:userId, users/me, users/me/avatar
const userNotValidId = {
  status: 404,
  message: 'Пользователь по указанному _id не найден',
};

// Ошибки роутинга карточек
// роут cards
const cardValidationError = {
  status: 400,
  message: 'Переданы некорректные данные при работе с карточкой',
};

// роут cards/:cardId, cards/:cardId/likes
const cardNotValidId = {
  status: 404,
  message: 'Карточка с указанным ID не найдена',
};

// роут авторизации
const unauthorizedError = {
  status: 401,
  message: 'Необходима авторизация',
};

const conflictError = {
  status: 409,
  message: 'Пользователь с такими данными уже существует',
};

const forbidden = {
  status: 403,
  message: 'Нет прав на удаление карточки',
};

module.exports = {
  defaultError,
  userValidationError,
  userNotValidId,
  cardValidationError,
  cardNotValidId,
  unauthorizedError,
  conflictError,
  forbidden,
};

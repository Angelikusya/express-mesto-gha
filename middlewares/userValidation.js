const { celebrate, Joi } = require('celebrate');

const URL = /^(http:\/\/|https:\/\/)(www\.)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(URL),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateAvatarUpdate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(URL),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    idUser: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  validateAvatarUpdate,
  validateUserAuthentication,
  validateUserId,
  validateUserInfo,
  validateUserUpdate,
};

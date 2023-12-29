const { Router } = require('express');
const {
  getUser,
  getUsers,
  createUser,
  getUserByID,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const {
  validateAvatarUpdate,
  validateUserId,
  validateUserUpdate,
} = require('../middlewares/userValidation');

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:idUser', validateUserId, getUserByID);
userRouter.post('/', validateUserId, createUser);
userRouter.patch('/me', validateUserUpdate, updateUserInfo);
userRouter.patch('/me/avatar', validateAvatarUpdate, updateUserAvatar);

module.exports = { userRouter };

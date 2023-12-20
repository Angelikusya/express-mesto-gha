const { Router } = require('express');
const { getUsers, createUser, getUserByID, updateUserInfo, updateUserAvatar } = require('../controllers/users');

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:idUser', getUserByID);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserInfo);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = { userRouter };

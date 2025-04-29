import express from 'express';

import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import usersControllers from '../controllers/usersControllers.js';

const usersRouter = express.Router();

usersRouter.patch(
  '/avatars',
  upload.single('avatar'),
  auth,
  usersControllers.updateUserAvatar
);

usersRouter.get('/followings', auth, usersControllers.getFollowing);

usersRouter.post('/following/:followerId', auth, usersControllers.followUser);

usersRouter.delete(
  '/following/:followerId',
  auth,
  usersControllers.unfollowUser
);

usersRouter.get('/followers', auth, usersControllers.getFollowers);

usersRouter.get('/:userId', auth, usersControllers.getUserById);

export default usersRouter;

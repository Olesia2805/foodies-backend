import express from 'express';

import auth from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import usersControllers from '../controllers/usersControllers.js';

const usersRouter = express.Router();

/**
 * @swagger
 * /api/users/followings/{followerId}:
 *   post:
 *     summary: Follow a user
 *     description: Follow a user by their ID. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: followerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRouter.post(
  '/followings/:followerId', 
  auth, 
  usersControllers.followUser
);

/**
 * @swagger
 * /api/users/followings/{followerId}:
 *   delete:
 *     summary: Unfollow a user
 *     description: Unfollow a user by their ID. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: followerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRouter.delete(
  '/followings/:followerId',
  auth,
  usersControllers.unfollowUser
);

/**
 * @swagger
 * /api/users/avatars:
 *   patch:
 *     summary: Update user avatar
 *     description: Update the avatar of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The new avatar image file
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
usersRouter.patch(
  '/avatars',
  upload.single('avatar'),
  auth,
  usersControllers.updateUserAvatar
);

/**
 * @swagger
 * /api/users/followings/{userId}:
 *   get:
 *     summary: Get followings
 *     description: Retrieve a list of users followed by the specified user. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of followings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the user
 *                     example: John Doe
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRouter.get(
  '/followings/:userId',
  auth,
  usersControllers.getFollowing
);

/**
 * @swagger
 * /api/users/followers/{userId}:
 *   get:
 *     summary: Get followers
 *     description: Retrieve a list of users following the specified user. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: A list of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the user
 *                     example: John Doe
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRouter.get(
  '/followers/:userId', 
  auth, 
  usersControllers.getFollowers
);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID
 *                   example: 6462a6f04c3d0ddd28897f9b
 *                 name:
 *                   type: string
 *                   description: The name of the user
 *                   example: John Doe
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
usersRouter.get(
  '/:userId', 
  auth, 
  usersControllers.getUserById
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     description: Retrieve a list of all users. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user ID
 *                     example: 6462a6f04c3d0ddd28897f9b
 *                   name:
 *                     type: string
 *                     description: The name of the user
 *                     example: John Doe
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
usersRouter.get(
  '/', 
  auth, 
  usersControllers.listUsers
);

export default usersRouter;

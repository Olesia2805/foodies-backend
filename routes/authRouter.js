import express from 'express';

import authController from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import {
  createUserSchema,
  getUserSchema,
  resendVerificationEmailSchema,
  refreshTokenSchema,
} from '../schemas/authSchema.js';

import auth from '../middlewares/auth.js';

const authRouter = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/register',
  validateBody(createUserSchema),
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user and return a token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/login', 
  validateBody(getUserSchema), 
  authController.login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Log out the authenticated user.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/logout', 
  auth, 
  authController.logout
);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Resend verification email
 *     description: Resend the email verification link to the user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/verify',
  validateBody(resendVerificationEmailSchema),
  authController.resendVerificationEmail
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh authentication token
 *     description: Refresh the authentication token using a refresh token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *                 example: some-refresh-token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  '/refresh-token',
  validateBody(refreshTokenSchema),
  authController.refresh
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the authenticated user.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
authRouter.get(
  '/me', 
  auth, 
  authController.getMe
);

/**
 * @swagger
 * /api/auth/verify/{verificationToken}:
 *   get:
 *     summary: Verify user email
 *     description: Verify the email address of a user using a verification token.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: verificationToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token sent to the user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
authRouter.get(
  '/verify/:verificationToken', 
  authController.verifyEmail
);


export default authRouter;

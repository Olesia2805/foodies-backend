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

authRouter.post(
  '/register',
  validateBody(createUserSchema),
  authController.register
);

authRouter.post('/login', validateBody(getUserSchema), authController.login);

authRouter.post('/logout', auth, authController.logout);

authRouter.get('/me', auth, authController.getMe);


authRouter.get('/verify/:verificationToken', authController.verifyEmail);

authRouter.post(
  '/verify',
  validateBody(resendVerificationEmailSchema),
  authController.resendVerificationEmail
);

authRouter.post(
  '/refresh-token',
  validateBody(refreshTokenSchema),
  authController.refresh
);


export default authRouter;

import Joi from 'joi';

import { emailRegexp } from '../constants/auth.js';

const baseAuthSchema = {
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
};

export const createUserSchema = Joi.object({
  ...baseAuthSchema,
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required',
  }),
});

export const resendVerificationEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required',
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
})

export const getUserSchema = Joi.object(baseAuthSchema);

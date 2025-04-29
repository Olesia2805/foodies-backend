import Joi from "joi";

import { emailRegexp } from "../constants/auth.js";

const baseAuthSchema = {
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
};

export const createUserSchema = Joi.object({
    ...baseAuthSchema,
    name: Joi.string().required(),
});

export const getUserSchema = Joi.object(baseAuthSchema);
import { UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import { v4 as uuidv4 } from 'uuid';
import sendEmail from '../helpers/sendEmail.js';

import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';

import { ERROR, SUCCESS } from '../constants/messages.js';
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from '../helpers/jwtHelper.js';

const register = async ({ name, email, password }) => {
  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    const avatarURL = gravatar.url(email, { protocol: 'https' });
    const verificationToken = uuidv4();

    await User.create({
      name: name,
      email: email,
      password: hashPassword,
      avatar: avatarURL,
      verificationToken: verificationToken,
    });

    await sendEmail({
      to: email,
      subject: 'Verify your email',
      text: 'Please verify your email.',
      user: { verificationToken },
    });

    return true;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw HttpError(409, ERROR.EMAIL_IN_USE);
    }
    throw error;
  }
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw HttpError(401, ERROR.EMAIL_OR_PASSWORD_IS_WRONG);
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verified');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw HttpError(401, ERROR.EMAIL_OR_PASSWORD_IS_WRONG);
  }

  const payload = {
    id: user._id,
    email: user.email,
  };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  user.token = accessToken;
  user.refreshToken = refreshToken;

  await user.save();

  return {
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    token: accessToken,
    refreshToken: refreshToken,
  };
};

const logout = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  user.token = null;
  user.refreshToken = null;

  await user.save();
};

const getMe = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  return {
    id: userId,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };
};

const verifyUser = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  user.verificationToken = null;
  user.verify = true;
  await user.save();

  return { message: SUCCESS.VERIFICATION_SUCCESSFULL };
};

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const findUserByVerificationToken = async (verificationToken) => {
  return await User.findOne({ where: { verificationToken } });
};

const resendVerificationEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    text: 'Please verify your email.',
    user: { verificationToken: user.verificationToken },
  });
};

const refresh = async (refreshToken) => {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw HttpError(403, ERROR.INVALID_REFRESH_TOKEN);
  }

  const user = await User.findByPk(payload.id);

  if (!user || user.refreshToken !== refreshToken)
    throw HttpError(403, ERROR.INVALID_REFRESH_TOKEN);

  const newAccessToken = createAccessToken({
    id: user._id,
    email: user.email,
  });
  const newRefreshToken = createRefreshToken({
    id: user._id,
    email: user.email,
  });

  user.token = newAccessToken;
  user.refreshToken = newRefreshToken;

  await user.save();

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export default {
  register,
  login,
  logout,
  getMe,
  verifyUser,
  findUserByEmail,
  findUserByVerificationToken,
  resendVerificationEmail,
  refresh,
};

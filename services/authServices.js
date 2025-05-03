import { UniqueConstraintError } from 'sequelize';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';

import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import { ERROR } from '../constants/messages.js';
import { createAccessToken, createRefreshToken, verifyRefreshToken } from '../helpers/jwtHelper.js';

const register = async ({ name, email, password }) => {
  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    const avatarURL = gravatar.url(email, { protocol: 'https' });

    return await User.create({
      name,
      email,
      password: hashPassword,
      avatar: avatarURL,
    });
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
    refreshToken,
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
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };
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

  const newAccessToken = createAccessToken({ id: user._id, email: user.email });
  const newRefreshToken = createRefreshToken({ id: user._id, email: user.email });

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
  refresh,
};

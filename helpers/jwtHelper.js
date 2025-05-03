import jwt from 'jsonwebtoken';

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

export const createAccessToken = (payload) =>
  jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });

export const createRefreshToken = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '1d' });

export const verifyAccessToken = (token) =>
  jwt.verify(token, JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, JWT_REFRESH_SECRET);

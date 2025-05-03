import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import { ERROR } from '../constants/messages.js';
import { verifyAccessToken } from '../helpers/jwtHelper.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw HttpError(401, ERROR.NOT_AUTHORIZED);
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findByPk(decoded.id);

    if (!user || user.token !== token) {
      throw HttpError(401, ERROR.NOT_AUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(HttpError(401, ERROR.ACCESS_TOKEN_EXPIRED));
    }

    next(HttpError(error.status || 401, error.message || ERROR.NOT_AUTHORIZED));
  }
};

export default auth;

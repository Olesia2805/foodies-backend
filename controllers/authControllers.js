import errorWrapper from '../helpers/errorWrapper.js';
import authService from '../services/authServices.js';
import { ERROR, SUCCESS } from '../constants/messages.js';

const register = async (req, res) => {
  await authService.register(req.body);

  res.status(201).send({ message: "Please verify your email" });
};

const login = async (req, res) => {
  const user = await authService.login(req.body);

  res.status(200).send({
    token: user.token,
    refreshToken: user.refreshToken,
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  });
};

const logout = async (req, res) => {
  await authService.logout(req.user._id);

  res.status(204).send();
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user._id);

  res.status(200).json(user);
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    return res.status(400).json({ message: ERROR.VERIFICATION_TOKEN_MISSING });
  }

  const user = await authService.findUserByVerificationToken(verificationToken);

  if (!user) {
    return res.status(404).json({ message: ERROR.USER_NOT_FOUND });
  }

  const response = await authService.verifyUser(verificationToken);

  res.status(200).json(response);
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  const user = await authService.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: ERROR.USER_NOT_FOUND });
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ message: SUCCESS.VERIFICATION_ALREADY_PASSED });
  }

  await authService.resendVerificationEmail(user);

  res.status(200).json({ message: SUCCESS.VERIFICATION_EMAIL_SENT });
};

const refresh = async (req, res) => {
  const token = await authService.refresh(req.body.refreshToken);

  res.status(200).send(token);
};

export default {
  register: errorWrapper(register),
  login: errorWrapper(login),
  logout: errorWrapper(logout),
  getMe: errorWrapper(getMe),
  verifyEmail: errorWrapper(verifyEmail),
  resendVerificationEmail: errorWrapper(resendVerificationEmail),
  refresh: errorWrapper(refresh),
};

import errorWrapper from '../helpers/errorWrapper.js';
import authService from '../services/authServices.js';

const register = async (req, res) => {
  const newUser = await authService.register(req.body);

  res.status(201).send({
    user: {
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    },
  });
};

const login = async (req, res) => {
  const user = await authService.login(req.body);

  res.status(200).send({
    token: user.token,
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
  const user = await authService.findUserByVerificationToken(verificationToken);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const response = await authService.verifyUser(verificationToken);

  res.status(200).json(response);
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'missing required field email' });
  }

  const user = await authService.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.verify) {
    return res.status(400).json({ message: 'Verification has already been passed' });
  }

  await authService.resendVerificationEmail(user);

  res.status(200).json({ message: 'Verification email sent' });
};

export default {
  register: errorWrapper(register),
  login: errorWrapper(login),
  logout: errorWrapper(logout),
  getMe: errorWrapper(getMe),
  verifyEmail: errorWrapper(verifyEmail),
  resendVerificationEmail: errorWrapper(resendVerificationEmail),
};

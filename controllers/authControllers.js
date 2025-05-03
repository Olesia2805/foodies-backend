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

const refresh = async (req, res) => {
  const token = await authService.refresh(req.body.refreshToken);

  res.status(200).send(token);
}

export default {
  register: errorWrapper(register),
  login: errorWrapper(login),
  logout: errorWrapper(logout),
  getMe: errorWrapper(getMe),
  refresh: errorWrapper(refresh),
};

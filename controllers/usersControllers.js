import errorWrapper from '../helpers/errorWrapper.js';
import usersServices from '../services/usersServices.js';

const getUserById = async (req, res) => {
  const user = await usersServices.getUserById(req.user, req.params.userId);

  res.status(200).json(user);
};

const updateUserAvatar = async (req, res) => {
  const updatedUser = await usersServices.updateUserAvatar(
    req.user._id,
    req.file
  );

  res.status(200).json({
    avatar: updatedUser.avatar,
  });
};

const followUser = async (req, res) => {
  const response = await usersServices.follow(
    req.user._id,
    req.params.followerId
  );

  res.status(200).json(response);
};

const unfollowUser = async (req, res) => {
  const response = await usersServices.unfollow(
    req.user._id,
    req.params.followerId
  );

  res.status(200).json(response);
};

const getFollowing = async (req, res) => {
  const response = await usersServices.getFollowing(req.params.userId);

  res.status(200).json(response);
};

const getFollowers = async (req, res) => {
  const response = await usersServices.getFollowers(req.params.userId);

  res.status(200).json(response);
};

const listUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const users = await usersServices.listUsers({ page: Number(page), limit: Number(limit) });

  res.status(200).json(users);
};

export default {
  getUserById: errorWrapper(getUserById),
  updateUserAvatar: errorWrapper(updateUserAvatar),
  followUser: errorWrapper(followUser),
  unfollowUser: errorWrapper(unfollowUser),
  getFollowing: errorWrapper(getFollowing),
  getFollowers: errorWrapper(getFollowers),
  listUsers: errorWrapper(listUsers),
};

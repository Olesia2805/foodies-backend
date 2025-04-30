import errorWrapper from '../helpers/errorWrapper.js';
import usersServices from '../services/usersServices.js';

const getUserById = async (req, res) => {
  const user = await usersServices.getUserById(req.user, req.params.userId);

  res.status(200).json(user);
};

const updateUserAvatar = async (req, res) => {
  const updatedUser = await usersServices.updateUserAvatar(
    req.user.id,
    req.file
  );

  res.status(200).json({
    avatar: updatedUser.avatar,
  });
};

const followUser = async (req, res) => {
  const response = await usersServices.follow(
    req.user.id,
    req.params.followerId
  );

  res.status(200).json(response);
};

const unfollowUser = async (req, res) => {
  const response = await usersServices.unfollow(
    req.user.id,
    req.params.followerId
  );

  res.status(200).json(response);
};

const getFollowing = async (req, res) => {
  const response = await usersServices.getFollowing(req.user.id);

  res.status(200).json(response);
};

const getFollowers = async (req, res) => {
  const response = await usersServices.getFollowers(req.user.id);

  res.status(200).json(response);
};

export default {
  getUserById: errorWrapper(getUserById),
  updateUserAvatar: errorWrapper(updateUserAvatar),
  followUser: errorWrapper(followUser),
  unfollowUser: errorWrapper(unfollowUser),
  getFollowing: errorWrapper(getFollowing),
  getFollowers: errorWrapper(getFollowers),
};

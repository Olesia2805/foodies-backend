import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { usersReturnsSchema } from '../schemas/userSchemas.js';
import { ERROR, SUCCESS } from '../constants/messages.js';

const avatarsDir = path.join('public', 'avatars');

const getUserById = async (authUser, userId) => {
  // TODO: Added count of favorite recipes and count of created recipes
  const user = await User.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'followers',
        attributes: ['_id'],
        through: { attributes: [] },
      },
      {
        model: User,
        as: 'following',
        attributes: ['_id'],
        through: { attributes: [] },
      },
    ],
  });

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  const isCurrentUser = authUser._id === user._id;

  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,

    followers: user.followers.map((follower) => follower._id),
    ...(isCurrentUser && {
      following: user.following.map((follower) => follower._id),
    }),
  };
};

const updateUserAvatar = async (userId, file) => {
  if (!file) {
    throw HttpError(400, ERROR.AVATAR_IS_REQUIRED);
  }

  const avatarURL = file.path;

  const user = await User.findOne({ where: { _id: userId } });

  if (!user) throw HttpError(404, ERROR.USER_NOT_FOUND);

  return user.update(
    { avatar: avatarURL },
    { returning: true }
  );
};

const follow = async (followerId, followingId) => {
  const following = await User.findByPk(followingId);
  const follower = await User.findByPk(followerId);

  if (!follower || !following) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  await follower.addFollowing(following);

  return { message: SUCCESS.FOLLOWED };
};

const unfollow = async (followerId, followingId) => {
  const follower = await User.findByPk(followerId);
  const following = await User.findByPk(followingId);

  if (!follower || !following) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  await follower.removeFollowing(following);

  return { message: SUCCESS.UNFOLLOWED };
};

const getFollowing = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  const following = await user.getFollowing();

  return usersReturnsSchema(following);
};

const getFollowers = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  const followers = await user.getFollowers();

  return usersReturnsSchema(followers);
};

export default {
  getUserById,
  updateUserAvatar,
  follow,
  unfollow,
  getFollowing,
  getFollowers,
};

import User from '../db/models/User.js';
import HttpError from '../helpers/HttpError.js';
import { usersReturnsSchema } from '../schemas/userSchemas.js';
import { ERROR, SUCCESS } from '../constants/messages.js';
import { calculatePagination } from '../helpers/paginationHelper.js';
import recipeService from './recipeServices.js';

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

  const userRecipes = await recipeService.getRecipes({userId: user._id});
  const userRecipesCount = userRecipes.data?.length;

  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,

    recipes: userRecipesCount,
    followers: user.followers.length,
    ...(isCurrentUser && {
      following: user.following.length,
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
  if (Number(followingId) === Number(followerId)) {
    throw HttpError(409, ERROR.CANT_SUBSCRIBE_TO_YOURSELF)
  }

  const following = await User.findByPk(followingId);
  const follower = await User.findByPk(followerId);

  if (!follower || !following) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  const followings = await follower.getFollowing();

  const isSubscribed = followings.some((follower) => follower._id === Number(followingId));

  if (isSubscribed) {
    throw HttpError(409, ERROR.ALREADY_SIGNED);
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

const getFollowing = async (userId, filters) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  const { page, limit, offset } = calculatePagination(filters);

  console.log('Pagination values:', { page, limit, offset });

  const followingData = await user.getFollowing({
    limit,
    offset,
    attributes: ['_id', 'name', 'email', 'avatar'],
  });

  console.log('Raw following data:', followingData);

  const count = await user.countFollowing();

  console.log('Total following count:', count);

  const totalPages = Math.ceil(count / limit);

  return {
    total: count,
    currentPage: page,
    pages: totalPages,
    data: followingData,
  };
};

const getFollowers = async (userId, filters) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw HttpError(404, ERROR.USER_NOT_FOUND);
  }

  const { page, limit, offset } = calculatePagination(filters);

  console.log('Pagination values:', { page, limit, offset });

  const followersData = await user.getFollowers({
    limit,
    offset,
    attributes: ['_id', 'name', 'email', 'avatar'],
  });

  console.log('Raw followers data:', followersData);

  const count = await user.countFollowers();

  console.log('Total followers count:', count);

  const totalPages = Math.ceil(count / limit);

  return {
    total: count,
    currentPage: page,
    pages: totalPages,
    data: followersData,
  };
};

const listUsers = async (filters = {}) => {
  const { page, limit, offset } = calculatePagination(filters);

  const { count, rows: users } = await User.findAndCountAll({
    limit,
    offset,
    attributes: ['_id', 'name', 'email', 'avatar'],
  });

  const totalPages = Math.ceil(count / limit);

  return {
    total: count,
    currentPage: page,
    pages: totalPages,
    data: users,
  };
};

export default {
  getUserById,
  updateUserAvatar,
  follow,
  unfollow,
  getFollowing,
  getFollowers,
  listUsers,
};

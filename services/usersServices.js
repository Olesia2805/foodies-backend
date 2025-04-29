import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";
import path from "node:path";
import fs from "node:fs/promises";
import { usersReturnsSchema } from "../schemas/userSchemas.js";

const avatarsDir = path.join("public", "avatars");

const getUserById = async (authUser, userId) => {
    // TODO: Added count of favorite recipes and count of created recipes
    const user = await User.findByPk(userId, {
        include: [
            {
                model: User,
                as: 'followers',
                attributes: ['id'],
                through: { attributes: [] },
            },
            {
                model: User,
                as: 'following',
                attributes: ['id'],
                through: { attributes: [] },
            },
        ],
    });

    if (!user) {
        throw HttpError(404, "User not found");
    }

    const isCurrentUser = authUser.id === user.id;

    return {
        name: user.name,
        email: user.email,
        avatar: user.avatar,

        followers: user.followers.map((follower) => follower.id),
        ...(isCurrentUser && {
            following: user.following.map((follower) => follower.id),
        })
    };
}

const updateUserAvatar = async (userId, file) => {
    if (!file) {
        throw HttpError(400, "Field 'avatar' is required");
    }

    const { path: oldPath, filename } = file;
    const newPath = path.join(avatarsDir, filename);

    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);

    const user = await User.findOne({ where: { id: userId } });

    if (!user) throw HttpError(404, "Not found");

    return user.update(
        { avatar: `${process.env.HOST}:${process.env.PORT}/${avatarURL}` },
        { returning: true }
    );
}

const follow = async (followerId, followingId) => {
    const following = await User.findByPk(followingId);
    const follower = await User.findByPk(followerId);

    if (!follower || !following) {
        throw HttpError(404, "User not found");
    }

    await follower.addFollowing(following);

    return { message: "Successfully followed" };
};

const unfollow = async (followerId, followingId) => {
    const follower = await User.findByPk(followerId);
    const following = await User.findByPk(followingId);

    if (!follower || !following) {
        throw HttpError(404, "User not found");
    }

    await follower.removeFollowing(following);

    return { message: "Successfully unfollowed" };
};

const getFollowing = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw HttpError(404, "User not found");
    }

    const following = await user.getFollowing();

    return usersReturnsSchema(following);
};

const getFollowers = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw HttpError(404, "User not found");
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

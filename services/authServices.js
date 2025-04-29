import { UniqueConstraintError } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const register = async ({ name, email, password }) => {
    try {
        const hashPassword = bcrypt.hashSync(password, 10);
        const avatarURL = gravatar.url(email, { protocol: 'https' });

        return await User.create({
            name,
            email,
            password: hashPassword,
            avatar: avatarURL,
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            throw HttpError(409, "Email in use")
        }

        throw error;
    }
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.token = token;

    await user.save();

    return {
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        token,
    };
};

const logout = async (userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw HttpError(404, "User not found");
    }

    user.token = null;
    await user.save();
};


const getMe = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (!user) {
        throw HttpError(404, "User not found");
    }

    return {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
    }
}

export default {
    register,
    login,
    logout,
    getMe,
};

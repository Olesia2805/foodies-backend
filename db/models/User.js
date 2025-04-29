import { DataTypes } from "sequelize";

import sequelize from "../Sequelize.js";
import {emailRegexp} from "../../constants/auth.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: emailRegexp,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        token: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    },
);

User.belongsToMany(User, {
    as: 'followers',
    through: 'UserFollowers',
    foreignKey: 'followingId',
    otherKey: 'followerId',
});

User.belongsToMany(User, {
    as: 'following',
    through: 'UserFollowers',
    foreignKey: 'followerId',
    otherKey: 'followingId',
});

export default User;

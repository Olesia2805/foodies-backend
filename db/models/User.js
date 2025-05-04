import { DataTypes } from 'sequelize';

import { emailRegexp } from '../../constants/auth.js';
import sequelize from '../Sequelize.js';

const User = sequelize.define('User', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
  verify: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
  },
  refreshToken: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  }
});

// User.sync({force: true});

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

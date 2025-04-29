import { DataTypes } from "sequelize";

import { emailRegexp } from "../../constants/auth.js";
import sequelize from "../Sequelize.js";

const User = sequelize.define("user", {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: emailRegexp,
    },
  },
  avatarURL: DataTypes.STRING,
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

User.sync();

export default User;

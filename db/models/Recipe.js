import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';
import User from './User.js';

const Recipe = sequelize.define('recipe', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Recipe.belongsTo(User, { foreignKey: 'owner', as: 'user' });

// Recipe.sync({force: true});

export default Recipe;

import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';
import User from './User.js';
import Recipe from './Recipe.js';

const UserFavorites = sequelize.define('userFavorites', {
  _id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: '_id',
    //   deferrable: DataTypes.Deferrable.INITIALLY_DEFERRED
    },
  },
  recipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'recipes',
      key: '_id',
    //   deferrable: DataTypes.Deferrable.INITIALLY_DEFERRED
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'recipe_id'],
    },
  ],
});

// UserFavorites.sync();
UserFavorites.sync({force: true});

export default UserFavorites; 
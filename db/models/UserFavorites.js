import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const UserFavorites = sequelize.define(
  'user_favorites',
  {
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
      },
    },
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recipes',
        key: '_id',
      },
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'recipe_id'],
      },
    ],
  }
);

// UserFavorites.sync();
// UserFavorites.sync({force: true});
// UserFavorites.sync({ alter: true });

export default UserFavorites;

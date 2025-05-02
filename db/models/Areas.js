import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const Area = sequelize.define(
  'areas',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export default Area;

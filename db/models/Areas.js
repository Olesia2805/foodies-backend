import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const Area = sequelize.define(
  'Area',
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
    tableName: 'areas',
    timestamps: false,
  }
);

export default Area;

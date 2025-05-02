import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';

const Area = sequelize.define('Area', {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    field: '_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'areas',
  timestamps: false 
});

export default Area;
import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';
import User from './User.js';

const Testimonial = sequelize.define(
  'testimonial',
  {
    _id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: '_id',
      },
    },
  },
  {
    timestamps: true,
  }
);

Testimonial.belongsTo(User, { 
  foreignKey: 'owner', 
  as: 'user' 
});

User.hasMany(Testimonial, { 
  foreignKey: 'owner', 
  as: 'testimonials' 
});

// Testimonial.sync();

export default Testimonial;

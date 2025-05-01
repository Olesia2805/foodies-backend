import { DataTypes } from 'sequelize';
import sequelize from '../Sequelize.js';
import User from './User.js';

const Testimonial = sequelize.define(
  'testimonial',
  {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
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

// Визначаємо зв'язок між моделями
Testimonial.belongsTo(User, { foreignKey: 'owner', as: 'user' });
User.hasMany(Testimonial, { foreignKey: 'owner', as: 'testimonials' });

// Синхронізуємо модель з базою даних
Testimonial.sync();

export default Testimonial;

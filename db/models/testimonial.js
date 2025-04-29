import { DataTypes } from "sequelize";
import sequelize from "../Sequelize.js";
import User from "./User.js";

const Testimonial = sequelize.define(
  "testimonial",
  {
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Визначаємо зв'язок між моделями
Testimonial.belongsTo(User, { foreignKey: "userId", as: "owner" });
User.hasMany(Testimonial, { foreignKey: "userId", as: "testimonials" });

// Синхронізуємо модель з базою даних
Testimonial.sync();

export default Testimonial;

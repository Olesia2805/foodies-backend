import Category from "../db/models/Category.js";
import sequelize from "../db/Sequelize.js";

const getAllCategories = async () => {
  return await Category.findAll({
      order: [['name', 'ASC']]
  });
};

export default {
  getAllCategories,
};
import Category from "../db/models/Category.js";
import sequelize from "../db/Sequelize.js";

const getAllCategories = async () => {
  const categories = await Category.findAll({
    order: [['name', 'ASC']]
});
  if (!categories) {
    const error = new Error("Categories not found");
    error.status = 404;
    throw error;
  }
  return categories;
};

export default {
  getAllCategories,
};
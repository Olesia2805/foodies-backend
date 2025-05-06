import Category from "../db/models/Category.js";
import {ERROR} from "../constants/messages.js";


const getAllCategories = async () => {
  const categories = await Category.findAll({
    attributes: ['_id', 'name', 'description', 'thumb'],
    order: [['name', 'ASC']]
});
  if (!categories) {
    const error = new Error(ERROR.CATEGORY_NOT_FOUND);
    error.status = 404;
    throw error;
  }
  return categories;
};

export default {
  getAllCategories,
};
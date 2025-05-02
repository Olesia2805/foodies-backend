import errorWrapper from "../helpers/errorWrapper.js";

import categoryService from "../services/categoryServices.js";

const getAllCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(categories);
}

export default {
  getAllCategories: errorWrapper(getAllCategories),
}
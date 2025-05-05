import { SUCCESS } from '../constants/messages.js';
import errorWrapper from "../helpers/errorWrapper.js";
import categoryService from "../services/categoryServices.js";

const getAllCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(categories);
}

const createCategory = async (req, res) => {
  const { name } = req.body;

  let image = null;
  if (req.file) {
    image = req.file.path;
  }

  const categoryData = {
    name,
    image,
  };

  const category = await categoryService.createCategory(categoryData);

  res.status(201).send({
    category,
    message: SUCCESS.CATEGORY_CREATED,
  });
};

export default {
  getAllCategories: errorWrapper(getAllCategories),
  createCategory: errorWrapper(createCategory),
}
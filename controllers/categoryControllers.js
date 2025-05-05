import { SUCCESS } from '../constants/messages.js';
import errorWrapper from "../helpers/errorWrapper.js";
import categoryService from "../services/categoryServices.js";
import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';
import Category from '../db/models/Category.js';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllCategories = async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(categories);
}

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  let thumb = null;

  if (req.file) {
    const result = await cloudinaryV2.uploader.upload(req.file.path);
    thumb = result.secure_url;
  }

  const categoryData = {
    name,
    description,
    thumb,
  };

  const category = await Category.create(categoryData);

  res.status(201).send({
    category,
    message: SUCCESS.CATEGORY_CREATED,
  });
};

export default {
  getAllCategories: errorWrapper(getAllCategories),
  createCategory: errorWrapper(createCategory),
}
import errorWrapper from '../helpers/errorWrapper.js';
import ingredientsService from '../services/ingredientsService.js';
import HttpError from '../helpers/HttpError.js';
import { Op } from 'sequelize';
import { ERROR } from '../constants/messages.js';

const getIngredients = async (req, res) => {
  const { page, limit } = req.query;

  const filters = {};
  if (limit) {
    filters.limit = Number(limit);
    if (page) filters.offset = Number(page) * Number(limit) - 1; // page in DB starts from zero
  }

  const data = await ingredientsService.listIngredients(null, filters);

  if (!data) {
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);
  }

  res.status(200).json(data);
};

const getIngredientByID = async (req, res) => {
  const data = await ingredientsService.oneIngredient(req.params.id);

  if (!data) throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);

  res.status(200).json(data);
};

const getIngredienList = async (req, res) => {
  const { ids } = req.query;

  const uniqueIds = [...new Set(ids)];
  const query = { _id: { [Op.in]: uniqueIds } };

  const { data } = await ingredientsService.listIngredients(query);

  if (data.length !== uniqueIds.length)
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);

  res.status(200).json(data);
};

export default {
  getIngredients: errorWrapper(getIngredients),
  getIngredientByID: errorWrapper(getIngredientByID),
  getIngredienList: errorWrapper(getIngredienList),
};

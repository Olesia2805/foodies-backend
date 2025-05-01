import errorWrapper from '../helpers/errorWrapper.js';
import ingredientsService from '../services/ingredientsService.js';
import HttpError from '../helpers/HttpError.js';
import { Op } from 'sequelize';
import { ERROR } from '../constants/messages.js';

const getIngredients = async (req, res) => {
  let { page, limit, ...restQuery } = req.query;
  const filters = {};

  page = Number(page);
  limit = Number(limit);

  if (limit) {
    filters.limit = limit;
    if (page) {
      filters.offset = (page - 1) * limit;
    }
  }

  const data = await ingredientsService.listIngredients(restQuery, filters);

  if (!Array.isArray(data?.data) || data.data.length === 0) {
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);
  }

  res.status(200).json(data);
};

const getIngredientByID = async (req, res) => {
  const data = await ingredientsService.oneIngredient(req.params.id);

  if (!data) {
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);
  }

  res.status(200).json(data);
};

const getIngredienList = async (req, res) => {
  let { ids } = req.query;

  if (typeof ids === 'string') {
    ids = [ids];
  }

  const uniqueIds = [...new Set(ids)];
  const query = { _id: { [Op.in]: uniqueIds } };

  const { data } = await ingredientsService.listIngredients(query);

  if (!data || data.length !== uniqueIds.length) {
    const foundIds = data ? data.map((item) => item._id.toString()) : [];
    const notFoundIds = uniqueIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw HttpError(404, ERROR.INGREDIENTS_WITH_ID_NOT_FOUND(notFoundIds));
    }
    throw HttpError(404, ERROR.INGREDIENT_NOT_FOUND);
  }

  res.status(200).json(data);
};

export default {
  getIngredients: errorWrapper(getIngredients),
  getIngredientByID: errorWrapper(getIngredientByID),
  getIngredienList: errorWrapper(getIngredienList),
};

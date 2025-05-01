import errorWrapper from '../helpers/errorWrapper.js';
import * as areasServices from '../services/areasServices.js';
import HttpError from '../helpers/HttpError.js';
import { ERROR } from '../constants/messages.js';

const getAreas = async (req, res, next) => {
  const result = await areasServices.getAllAreas();

  if (!result || result.length === 0) {
    throw HttpError(404, ERROR.AREAS_NOT_FOUND);
  }

  res.status(200).json(result);
};

const getAreasByName = async (req, res, next) => {
  const { name } = req.query;
  const areas = await areasServices.findAreasByName(name);

  if (!areas || areas.length === 0) {
    throw HttpError(404, ERROR.AREAS_NOT_FOUND);
  }

  return res.status(200).json(areas);
};

export default {
  getAreas: errorWrapper(getAreas),
  getAreasByName: errorWrapper(getAreasByName),
};

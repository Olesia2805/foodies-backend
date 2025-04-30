import errorWrapper from '../helpers/errorWrapper.js';
import * as areasServices from '../services/areasServices.js';

const getAreas = async (req, res, next) => {
  const result = await areasServices.getAllAreas();
  res.json(result);
};

const getAreasByName = async (req, res, next) => {
  const { name } = req.query;
    const areas = await areasServices.findAreasByName(name);
    return res.status(200).json(areas);
};

export default {
  getAreas: errorWrapper(getAreas),
  getAreasByName: errorWrapper(getAreasByName),
};
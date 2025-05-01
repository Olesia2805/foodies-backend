import Area from '../db/models/Areas.js';
import { Op } from 'sequelize';

export const getAllAreas = async () => {
  const areas = await Area.findAll();
  return areas;
};

export const findAreasByName = async (name) => {
  const areasByName = await Area.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
    order: [['name', 'ASC']],
  });
  return areasByName;
};

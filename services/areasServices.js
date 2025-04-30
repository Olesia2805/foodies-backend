import Area from '../db/models/Areas.js';
import { Op } from 'sequelize';

export const getAllAreas = () => Area.findAll();
export const getAreaById = (id) => Area.findByPk(id);

export const findAreasByName = (name) => {
  return Area.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%` 
      }
    },
    order: [['name', 'ASC']] 
  });
};
import errorWrapper from "../helpers/errorWrapper.js";
import ingredientsService from "../services/ingredientsService.js";
import HttpError from "../helpers/HttpError.js";
import { Op } from "sequelize";

const getIngredients = async (req, res) => {
    const { page, limit } = req.query;

    const filters = {};
    if (limit) {
        filters.limit = Number(limit);
        if (page) filters.offset = Number(page) * Number(limit);
    }

    const data = await ingredientsService.listIngredients(undefined, filters);
    res.status(200).json(data);
};

const getIngredientByID = async (req, res) => {
    const data = await ingredientsService.oneIngredient(req.params.id);

    if (!data) throw HttpError(404, "Not found");

    res.status(200).json(data);
};

const getIngredienList = async (req, res) => {
    const { ids } = req.query;
    const query = { _id: { [Op.in]: ids } };

    const { data } = await ingredientsService.listIngredients(query);

    if (req.query.ids.length !== data.length) throw HttpError(404, "Not found");

    res.status(200).json(data);
};

export default {
    getIngredients: errorWrapper(getIngredients),
    getIngredientByID: errorWrapper(getIngredientByID),
    getIngredienList: errorWrapper(getIngredienList),
};

import Joi from "joi";

export const ingredientsGetAll = Joi.object({
    page: Joi.number().error(new Error("Query parameter 'page' is a number or is not set")),
    limit: Joi.number().error(new Error("Query parameter 'limit' is a number or is not set")),
});

export const ingredientsGetList = Joi.object({
    ids: Joi.array().items(Joi.string()).required().error(new Error("Query parameter 'ids' is an am array of string(_id) and required")),
});

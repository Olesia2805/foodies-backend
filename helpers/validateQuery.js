import HttpError from './HttpError.js';

const validateQuery = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      const message = error.details.map((detail) => detail.message).join('. ');
      return next(HttpError(400, message));
    }
    next();
  };

  return func;
};

export default validateQuery;

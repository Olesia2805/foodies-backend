import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import HttpError from "../helpers/HttpError.js";

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || "";

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            throw HttpError(401, "Not authorized");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.id);

        if (!user || user.token !== token) {
            throw HttpError(401, "Not authorized");
        }

        req.user = user;

        next();
    } catch (error) {
        next(HttpError(error.status, error.message));
    }
};

export default auth;

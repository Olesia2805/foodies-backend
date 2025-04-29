import * as path from "node:path";
import multer from "multer";
import fs from "fs/promises";
import HttpError from "../helpers/HttpError.js";

const tempDir = path.join("temp");
const avatarsDir = path.join("public", "avatars");
const recipesDir = path.join("public", "recipes");

// Ensure directories exist
try {
    await fs.access(tempDir);
} catch (error) {
    await fs.mkdir(tempDir);
}

try {
    await fs.access(avatarsDir);
} catch (error) {
    await fs.mkdir(avatarsDir);
}

try {
    await fs.access(recipesDir);
} catch (error) {
    await fs.mkdir(recipesDir);
}

const storage = multer.diskStorage({
    destination: tempDir,
    filename: (req, file, callback) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
        const filename = `${uniquePrefix}_${file.originalname}`;
        callback(null, filename);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 5,
}

const fileFilter = (req, file, callback) => {
    const ext = file.originalname.split(".").pop();
    if (!["jpg", "png"].includes(ext)) {
        return callback(HttpError(400, "Invalid file extension"));
    }

    callback(null, true);
}


const upload = multer({ storage, limits, fileFilter });

// Middleware to move uploaded files from temp to destination folders
const moveFile = (destination) => async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const { path: tempPath, filename } = req.file;
        const targetPath = path.join(destination, filename);
        
        await fs.rename(tempPath, targetPath);
        
        req.file.path = targetPath;
        req.file.destination = destination;
        
        next();
    } catch (error) {
        next(HttpError(500, error.message));
    }
};

// Export middleware functions
upload.moveAvatarToPublic = moveFile(avatarsDir);
upload.moveRecipeImageToPublic = moveFile(recipesDir);

export default upload;

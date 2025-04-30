import * as path from 'node:path';
import multer from 'multer';
import fs from 'fs/promises';
import HttpError from '../helpers/HttpError.js';
import { AVAILABLE_AVATAR_IMAGE_TYPES } from '../constants/fileTypes.js';
import { ERROR } from '../constants/messages.js';

const tempDir = path.resolve('temp');
const avatarsDir = path.resolve('public', 'avatars');
const recipesDir = path.resolve('public', 'recipes');

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
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const ext = file.originalname.split('.').pop();
  if (!AVAILABLE_AVATAR_IMAGE_TYPES.includes(ext)) {
    return callback(HttpError(400, ERROR.INVALID_FILE_EXTENSION));
  }

  callback(null, true);
};

const upload = multer({ storage, limits, fileFilter });

const moveFile = (destination) => async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { path: tempPath, filename } = req.file;
    const targetPath = path.resolve(destination, filename);

    await fs.rename(tempPath, targetPath);

    req.file.path = targetPath;
    req.file.destination = destination;

    next();
  } catch (error) {
    next(HttpError(500, error.message));
  }
};

upload.moveAvatarToPublic = moveFile(avatarsDir);
upload.moveRecipeImageToPublic = moveFile(recipesDir);

export default upload;

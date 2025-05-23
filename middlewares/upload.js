import multer from 'multer';

import fs from 'fs/promises';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


import HttpError from '../helpers/HttpError.js';
import { AVAILABLE_AVATAR_IMAGE_TYPES } from '../constants/fileTypes.js';
import { ERROR } from '../constants/messages.js';
import path from 'node:path';

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: AVAILABLE_AVATAR_IMAGE_TYPES,
  },
});


const categoryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'categories',
    allowed_formats: AVAILABLE_AVATAR_IMAGE_TYPES,
  },
});

const recipeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'recipes',
    allowed_formats: AVAILABLE_AVATAR_IMAGE_TYPES,
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  //TODO
  // if (!file || !file.originalname) {
  //   return callback(HttpError(400, 'Invalid file'));
  // }
  const ext = file.originalname.split('.').pop();
  if (!AVAILABLE_AVATAR_IMAGE_TYPES.includes(ext)) {
    return callback(HttpError(400, ERROR.INVALID_FILE_EXTENSION));
  }
  callback(null, true);
};

const upload = multer({ 
  storage, 
  limits, 
  fileFilter 
});

const uploadRecipeImage = multer({
  storage: recipeStorage,
  limits,
  fileFilter,
  fieldName: 'thumb',
});

const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits,
  fileFilter,
});

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

    //TODO
    // console.error(
    //   `Failed to move file from ${req.file.path} to ${destination}`,
    //   error
    // );

    // try {
    //   await fs.unlink(req.file.path);
    // } catch (unlinkError) {
    //   console.error(
    //     `Failed to delete temporary file: ${req.file.path}`,
    //     unlinkError
    //   );
    // }

    // next(HttpError(500, 'Failed to process uploaded file'));
  }
};

upload.moveAvatarToPublic = moveFile(avatarsDir);
upload.moveRecipeImageToPublic = moveFile(recipesDir);

export default upload;

export { uploadCategoryImage, uploadRecipeImage };

import * as path from 'node:path';
import multer from 'multer';
import HttpError from '../helpers/HttpError.js';
import { AVAILABLE_AVATAR_IMAGE_TYPES } from '../constants/fileTypes.js';
import { ERROR } from '../constants/messages.js';

const tempDir = path.resolve('temp');

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

export default upload;

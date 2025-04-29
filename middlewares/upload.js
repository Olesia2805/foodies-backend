import * as path from 'node:path';
import multer from 'multer';
import HttpError from '../helpers/HttpError.js';

const tempDir = path.join('temp');

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
  if (!['jpg', 'png'].includes(ext)) {
    return callback(HttpError(400, 'Invalid file extension'));
  }

  callback(null, true);
};

const upload = multer({ storage, limits, fileFilter });

export default upload;

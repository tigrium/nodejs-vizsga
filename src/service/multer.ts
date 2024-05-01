import fs from 'fs/promises';
import path from 'path';
import multer, { Multer } from 'multer';
import { v4 as uuid } from 'uuid';

export const UPLOADS_DIR = './uploads';

export const initMulter = async (): Promise<Multer> => {
  try {
    await fs.access(UPLOADS_DIR);
  } catch (err) {
    fs.mkdir(UPLOADS_DIR);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      return cb(null, `${file.fieldname}-${uuid()}${ext}`);
    },
  });

  return multer({ storage });
};

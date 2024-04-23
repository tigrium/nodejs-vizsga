import express from 'express';
import { UPLOADS_DIR } from '../service/multer';

export const staticRouter = () => {
  const router = express.Router();

  // App static
  router.use(express.static('public'));
  router.use('/uploads', express.static(UPLOADS_DIR));

  // Bootstrap
  router.use('/css', express.static('node_modules/bootstrap/dist/css'));
  router.use('/js', express.static('node_modules/bootstrap/dist/js'));
  // router.use("/js", express.static("node_modules/jquery/dist"));
  router.use('/font', express.static('node_modules/bootstrap-icons/font'));

  return router;
};

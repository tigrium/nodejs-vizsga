import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import { addRoutes } from './routing';
import { initDatabase } from './service/db';
import { getProcessEnv, initProcessEnv } from './service/processEnv';
import { getSessionMW } from './middlewares/getSessionMW';
import { staticRouter } from './routing/static';

(async () => {
  try {
    initProcessEnv();
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    const db = await initDatabase();
    app.use(staticRouter());
    app.use(getSessionMW(app));

    addRoutes(app, db);

    const port = getProcessEnv('PORT', (v) => parseInt(v, 10), 3000);
    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
})();

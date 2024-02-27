/* eslint-disable @typescript-eslint/ban-ts-comment */
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connect, set } from 'mongoose';
import { NODE_ENV, PORT, ORIGIN, HAS_CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import ErrorMiddleware from '@middlewares/error.middleware';
import { logger, Logger } from '@utils/logger';
import { NotFoundError } from '@exceptions/HttpException';
// import rateLimiter from '@utils/rateLimiter';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    // @ts-ignore
    connect(dbConnection.url, dbConnection.options)
      .then(() => {
        logger.info('Connected to Database Successfully...');
      })
      .catch(error => {
        logger.error(`Error connecting to Database: ${error}`);
      });
  }

  private initializeMiddlewares() {
    this.app.use(Logger.getHttpLoggerInstance());
    this.app.use(cors({ origin: ORIGIN, credentials: HAS_CREDENTIALS }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '50kb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => next(new NotFoundError(req.path)));
    this.app.use(ErrorMiddleware.handleError());
  }
}

export default App;

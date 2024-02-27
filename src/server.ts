import App from '@/app';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import ErrorMiddleware from '@middlewares/error.middleware';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute()]);

app.listen();

ErrorMiddleware.initializeUnhandledException();

process.on('SIGTERM', () => {
  console.info('SIGTERM received');
});

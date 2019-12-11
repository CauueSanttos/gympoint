import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

routes.post('/students/:student_id/help-orders', HelpOrderController.store);
routes.get('/students/:student_id/help-orders', HelpOrderController.index);

routes.use(authMiddleware);

routes.post('/student', StudentController.store);
routes.put('/student', StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id/update', PlanController.update);
routes.delete('/plans/:id/delete', PlanController.delete);

routes.post('/enrollments', EnrollmentController.store);
routes.get('/enrollments', EnrollmentController.index);
routes.put('/enrollments/:id/:student_id', EnrollmentController.update);
routes.delete('/enrollments/:id/:student_id', EnrollmentController.delete);

routes.get('/help-orders/all', HelpOrderController.index);
routes.put('/help-orders/:id/:student_id/answer', HelpOrderController.update);

export default routes;

import express from 'express';
import IController from '../interfaces/IController';

function buildStandardRouter(controller): express.Router {
	const router: express.Router = express.Router();

	router.get('/', controller.retrieveAll);
	router.get('/:id', controller.retrieveById);
	router.post('/', controller.createOne);
	router.put('/:id', controller.updateById);
	router.delete('/:id', controller.deleteById);

	return router;
}

export default buildStandardRouter;
import express from 'express';
import IController from '../interfaces/IController'

/**
 * A function that creates an express.Router based on the controller passed in.
 * @param controller 
 */
function buildStandardRouter(controller: IController): express.Router {
	const router: express.Router = express.Router();

	router.get('/', controller.retrieveAll);
	router.get('/:id', controller.retrieveById);
	router.post('/', controller.createOne);
	router.put('/:id', controller.updateById);
	router.delete('/:id', controller.deleteById);

	return router;
}

export default buildStandardRouter;
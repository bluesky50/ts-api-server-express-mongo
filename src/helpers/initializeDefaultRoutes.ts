import { Application } from 'express';

// Mongoose models
import User from '../models/User';
import Post from '../models/Post';
import Comments from '../models/Comment';

import BasicController from '../classes/BasicController';
import CollectionAdapter from '../classes/CollectionAdapter';
import buildStandardRouter from './buildStandardRouter';

// Endpoint Router validation schemas.
import { UserValidationSchema, PostValidationSchema, CommentValidationSchema } from '../helpers/validationSchemas'

function initializeDefaultRoutes(app: Application): void {

	const usersController = new BasicController(new CollectionAdapter(User), UserValidationSchema);
	const postsController = new BasicController(new CollectionAdapter(Post), PostValidationSchema);
	const commentsController = new BasicController(new CollectionAdapter(Comments), CommentValidationSchema);

	app.use('/users', buildStandardRouter(usersController));
	app.use('/posts', buildStandardRouter(postsController));
	app.use('/comments', buildStandardRouter(commentsController));
}

export default initializeDefaultRoutes;
import User from '../models/User';
import Post from '../models/Post';
import Comments from '../models/Comment';

import CollectionAdapter from '../classes/CollectionAdapter';
import BasicController from '../classes/BasicController';

import { UserValidationSchema, PostValidationSchema, CommentValidationSchema } from '../helpers/validationSchemas'

const usersController = new BasicController(new CollectionAdapter(User), UserValidationSchema);
const postsController = new BasicController(new CollectionAdapter(Post), PostValidationSchema);
const commentsController = new BasicController(new CollectionAdapter(Comments), CommentValidationSchema);

/**
 * Sets the route configurations that the server uses to initialize routes.
 */
const routesConfig = {
	usersEndpoints: {
		route: '/users',
		type: 'standard', // standard or custom
		controller: usersController,
		useBuilder: false,
		builder: null, // function that will build the routers.
	},
	postsEndpoints: {
		route: '/posts',
		type: 'standard',
		controller: postsController,
		useBuilder: false,
		builder: null
	},
	commentsEndpoints: {
		route: '/comments',
		type: 'standard',
		controller: commentsController,
		userBuilder: false,
		builder: null
	}
}

export default routesConfig;
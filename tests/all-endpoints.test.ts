require('../src/configs/processConfig');

process.env.NODE_ENV = 'test';

const request = require('supertest');

import mongoose from 'mongoose';
import User from '../src/models/User';
import Post from '../src/models/Post';
import Comment from '../src/models/Comment';
import { SC } from '../src/configs/statusCodes';

/**
 * Initialize server so that the app: express.Application can be configured properly.
 */
import server from './server-instance';

/**
 * Get the app: express.Application.
 */
const app = server.getApp();

/**
 * Initialize users description strings.
 */
const USERS_ROUTE = '/users';
const USER_SLUG = '/:id';
const SINGLE_USERS_ROUTE = `${USERS_ROUTE}${USER_SLUG}`;
const GET_USERS_TEST_DESCRIPTION = `GET ${USERS_ROUTE}`;
const GET_USER_TEST_DESCRIPTION = `GET ${SINGLE_USERS_ROUTE}`;
const POST_USER_TEST_DESCRIPTION = `POST ${USERS_ROUTE}`;
const PUT_USER_TEST_DESCRIPTION = `PUT ${SINGLE_USERS_ROUTE}`;
const DELETE_USER_TEST_DESCRIPTION = `DELETE ${SINGLE_USERS_ROUTE}`;

const firstUserId = new mongoose.Types.ObjectId().toHexString();

const usersArray = [
	{
		_id: firstUserId,
		username: "jsmith",
		email: "jsmith@me.com",
		about: "jsmith's profile",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		username: "dwilson",
		email: "dwilson@me.com",
		about: "dwilson's profile",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		username: "wjohnson",
		email: "wjohnson@me.com",
		about: "wjohnson's profile",
	}
];

const newUser = {
	_id: new mongoose.Types.ObjectId().toHexString(),
	username: "bdavidson",
	email: "bdavidson@me.com",
	about: "bdavidson's profile",
};

const udpateUser = {
	username: "jsmith",
	email: "jsmith@newEmail.com",
	about: "jsmith's new profile"
}

//TODO: Implement tests for invalid request body objects.
describe('Test the endpoints for /users', () => {

	// beforeAll(() => {});
	beforeEach((done) => {
		User.remove({})
			.then(() => {
				return User.insertMany(usersArray);
			})
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	// afterEach((done) => {
	// 	User.remove({})
	// 		.then(() => {
	// 			done();
	// 		})
	// 		.catch((err) => {
	// 			done(err);
	// 		});
	// });

	describe(`${GET_USERS_TEST_DESCRIPTION}`, () => {

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).get(USERS_ROUTE)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(Array.isArray(data)).toBe(true);
					expect(data.length).toBe(usersArray.length);
					expect(data).toEqual(usersArray);
					done();
				});
		});
	});

	describe(`${GET_USER_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).get(`${USERS_ROUTE}/${firstUserId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(usersArray[0]);
					done();
				});
		});
	});

	describe(`${POST_USER_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).post(USERS_ROUTE)
				.send(newUser)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newUser);
					done();
				});
		});

		test('Server response should be a single object', (done) => {
			return request(app).post(USERS_ROUTE)
				.send(newUser)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newUser);

					return request(app).get(`${USERS_ROUTE}/${newUser._id}`)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(data2).toEqual(newUser);
							done();
						});
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).post(USERS_ROUTE)
				.send(newUser)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newUser);

					return request(app).get(USERS_ROUTE)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(Array.isArray(data2)).toBe(true);
							expect(data2.length).toBe(usersArray.length + 1);
							expect(data2).toEqual(usersArray.concat([newUser]));
							done();
						});
			});
		});
	});

	describe(`${PUT_USER_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).put(`${USERS_ROUTE}/${firstUserId}`)
				.send(udpateUser)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual({...udpateUser, _id: firstUserId});
					done();
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).put(`${USERS_ROUTE}/${firstUserId}`)
				.send(udpateUser)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual({...udpateUser, _id: firstUserId});
					
					return request(app).get(`${USERS_ROUTE}/${firstUserId}`)
						.then((r) => {

							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(data2).toEqual({ ...usersArray[0], ...udpateUser });
							done();

							// Testing for all the objects to match.
							// Actually only need to test if that one object was updated.
							// const data2 = r.body.data;
							// expect(r.statusCode).toBe(SC.STATUS_OK);

							// const comparisonArray = [...usersArray];
							// comparisonArray[0] = {...usersArray[0], ...udpateUser};
							// expect(data2).toEqual(comparisonArray);
							// done();
						});
					});
		});
	});

	describe(`${DELETE_USER_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).delete(`${USERS_ROUTE}/${firstUserId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(usersArray[0]);
					done();
				});
		});
		test(`Server response should be multiple objects in an array`, (done) => {
			return request(app).delete(`${USERS_ROUTE}/${firstUserId}`)
			.then((res) => {
				const data = res.body.data;
				expect(res.statusCode).toBe(SC.STATUS_OK);
				expect(data).toEqual(usersArray[0]);
				
				return request(app).get(USERS_ROUTE)
					.then((r) => {
						const data2 = r.body.data;
						expect(r.statusCode).toBe(SC.STATUS_OK);
						expect(Array.isArray(data2)).toBe(true);

						const comparisonArray = usersArray.slice(1);
						expect(data2.length).toBe(comparisonArray.length);
						expect(data2).toEqual(comparisonArray);
						done();
					});
			});
		})
	});
});


/**
 * Initialize posts description strings.
 */
const POSTS_ROUTE = '/posts';
const POST_SLUG = '/:id';
const SINGLE_POSTS_ROUTE = `${POSTS_ROUTE}${POST_SLUG}`;
const GET_POSTS_TEST_DESCRIPTION = `GET ${POSTS_ROUTE}`;
const GET_POST_TEST_DESCRIPTION = `GET ${SINGLE_POSTS_ROUTE}`;
const POST_POST_TEST_DESCRIPTION = `POST ${POSTS_ROUTE}`;
const PUT_POST_TEST_DESCRIPTION = `PUT ${SINGLE_POSTS_ROUTE}`;
const DELETE_POST_TEST_DESCRIPTION = `DELETE ${SINGLE_POSTS_ROUTE}`;

const firstPostId = new mongoose.Types.ObjectId().toHexString();

const postsArray = [
	{
		_id: firstPostId,
		title: "Post1-Title",
		author: new mongoose.Types.ObjectId().toHexString(),
		content: "Post1-Content",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		title: "Post2-Title",
		author: new mongoose.Types.ObjectId().toHexString(),
		content: "Post2-Content",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		title: "Post3-Title",
		author: new mongoose.Types.ObjectId().toHexString(),
		content: "Post3-Content",
	}
];

const newPost = {
	_id: new mongoose.Types.ObjectId().toHexString(),
	title: "Post4-Title",
	author: new mongoose.Types.ObjectId().toHexString(),
	content: "Post4-Content",
};

const updatePost = {
	title: "Post1-Title-Updated",
	author: postsArray[0].author,
	content: "Post1-Content-Updated",
}

//TODO: Implement tests for invalid request body objects.
describe(`Test the endpoints for ${POSTS_ROUTE}`, () => {

	// beforeAll(() => {

	// });

	beforeEach((done) => {
		Post.remove({})
			.then(() => {
				return Post.insertMany(postsArray);
			})
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	// afterEach((done) => {
	// 	User.remove({})
	// 		.then(() => {
	// 			done();
	// 		})
	// 		.catch((err) => {
	// 			done(err);
	// 		});
	// });

	describe(`${GET_POSTS_TEST_DESCRIPTION}`, () => {

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).get(POSTS_ROUTE)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(Array.isArray(data)).toBe(true);
					expect(data.length).toBe(postsArray.length);
					expect(data).toEqual(postsArray);
					done();
				});
		});
	});

	describe(`${GET_POST_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).get(`${POSTS_ROUTE}/${firstPostId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(postsArray[0]);
					done();
				});
		});
	});

	describe(`${POST_POST_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).post(POSTS_ROUTE)
				.send(newPost)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newPost);
					done();
				});
		});

		test('Server response should be a single object', (done) => {
			return request(app).post(POSTS_ROUTE)
				.send(newPost)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newPost);

					return request(app).get(`${POSTS_ROUTE}/${newPost._id}`)
						
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(data2).toEqual(newPost);
							done();
						});
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).post(POSTS_ROUTE)
				.send(newPost)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newPost);

					return request(app).get(POSTS_ROUTE)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(Array.isArray(data2)).toBe(true);
							expect(data2.length).toBe(postsArray.length + 1);
							expect(data2).toEqual(postsArray.concat([newPost]));
							done();
						});
			});
		});
	});

	describe(`${PUT_POST_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).put(`${POSTS_ROUTE}/${firstPostId}`)
				.send(updatePost)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual({...updatePost, _id: firstPostId});
					done();
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).put(`${POSTS_ROUTE}/${firstPostId}`)
				.send(updatePost)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual({...updatePost, _id: firstPostId});
					
					return request(app).get(`${POSTS_ROUTE}/${firstPostId}`)
						.then((r) => {

							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(data2).toEqual({ ...postsArray[0], ...updatePost });
							done();

							// Testing for all the objects to match.
							// Actually only need to test if that one object was updated.
							// const data2 = r.body.data;
							// expect(r.statusCode).toBe(SC.STATUS_OK);

							// const comparisonArray = [...postsArray];
							// comparisonArray[0] = {...postsArray[0], ...updatePost};
							// expect(data2).toEqual(comparisonArray);
							// done();
						});
					});
		});
	});

	describe(`${DELETE_POST_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).delete(`${POSTS_ROUTE}/${firstPostId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(postsArray[0]);
					done();
				});
		});
		test(`Server response should be multiple objects in an array`, (done) => {
			return request(app).delete(`${POSTS_ROUTE}/${firstPostId}`)
			.then((res) => {
				const data = res.body.data;
				expect(res.statusCode).toBe(SC.STATUS_OK);
				expect(data).toEqual(postsArray[0]);
				
				return request(app).get(POSTS_ROUTE)
					.then((r) => {
						const data2 = r.body.data;
						expect(r.statusCode).toBe(SC.STATUS_OK);
						expect(Array.isArray(data2)).toBe(true);

						const comparisonArray = postsArray.slice(1);
						expect(data2.length).toBe(comparisonArray.length);
						expect(data2).toEqual(comparisonArray);
						done();
					});
			});
		})
	});
});


/**
 * Initialize comments description strings.
 */
const COMMENTS_ROUTE = '/comments';
const COMMENT_SLUG = '/:id';
const SINGLE_COMMENTS_ROUTE = `${COMMENTS_ROUTE}${COMMENT_SLUG}`;
const GET_COMMENTS_TEST_DESCRIPTION = `GET ${COMMENTS_ROUTE}`;
const GET_COMMENT_TEST_DESCRIPTION = `GET ${SINGLE_COMMENTS_ROUTE}`;
const POST_COMMENT_TEST_DESCRIPTION = `POST ${COMMENTS_ROUTE}`;
const PUT_COMMENT_TEST_DESCRIPTION = `PUT ${SINGLE_COMMENTS_ROUTE}`;
const DELETE_COMMENT_TEST_DESCRIPTION = `DELETE ${SINGLE_COMMENTS_ROUTE}`;

const firstCommentId = new mongoose.Types.ObjectId().toHexString();

const commentsArray = [
	{
		_id: firstCommentId,
		user: new mongoose.Types.ObjectId().toHexString(),
		post: new mongoose.Types.ObjectId().toHexString(),
		content: "comment1",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		user: new mongoose.Types.ObjectId().toHexString(),
		post: new mongoose.Types.ObjectId().toHexString(),
		content: "comment2",
	}, {
		_id: new mongoose.Types.ObjectId().toHexString(),
		user: new mongoose.Types.ObjectId().toHexString(),
		post: new mongoose.Types.ObjectId().toHexString(),
		content: "comment3",
	}
];

const newComment = {
	_id: new mongoose.Types.ObjectId().toHexString(),
	user: new mongoose.Types.ObjectId().toHexString(),
	post: new mongoose.Types.ObjectId().toHexString(),
	content: "comment4",
};

const updateComment = {
	user: commentsArray[0].user,
	post: commentsArray[0].post,
	content: "comment1-updated",
}

//TODO: Implement tests for invalid request body objects.
describe(`Test the endpoints for ${COMMENTS_ROUTE}`, () => {

	// beforeAll(() => {});
	beforeEach((done) => {
		Comment.remove({})
			.then(() => {
				return Comment.insertMany(commentsArray);
			})
			.then(() => {
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	// afterEach((done) => {
	// 	User.remove({})
	// 		.then(() => {
	// 			done();
	// 		})
	// 		.catch((err) => {
	// 			done(err);
	// 		});
	// });

	describe(`${GET_COMMENTS_TEST_DESCRIPTION}`, () => {

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).get(COMMENTS_ROUTE)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(Array.isArray(data)).toBe(true);
					expect(data.length).toBe(commentsArray.length);
					expect(data).toEqual(commentsArray);
					done();
				});
		});
	});

	describe(`${GET_COMMENT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).get(`${COMMENTS_ROUTE}/${firstCommentId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(commentsArray[0]);
					done();
				});
		});
	});

	describe(`${POST_COMMENT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).post(COMMENTS_ROUTE)
				.send(newComment)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newComment);
					done();
				});
		});

		test('Server response should be a single object', (done) => {
			return request(app).post(COMMENTS_ROUTE)
				.send(newComment)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newComment);

					return request(app).get(`${COMMENTS_ROUTE}/${newComment._id}`)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(data2).toEqual(newComment);
							done();
						});
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).post(COMMENTS_ROUTE)
				.send(newComment)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(newComment);

					return request(app).get(COMMENTS_ROUTE)
						.then((r) => {
							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(Array.isArray(data2)).toBe(true);
							expect(data2.length).toBe(commentsArray.length + 1);
							expect(data2).toEqual(commentsArray.concat([newComment]));
							done();
						});
			});
		});
	});

	describe(`${PUT_COMMENT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).put(`${COMMENTS_ROUTE}/${firstCommentId}`)
				.send(updateComment)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual({...updateComment, _id: firstCommentId});
					done();
				});
		});

		test('Server response should be multiple objects in an array', (done) => {
			return request(app).put(`${COMMENTS_ROUTE}/${firstCommentId}`)
				.send(updateComment)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual({...updateComment, _id: firstCommentId});
					
					return request(app).get(`${COMMENTS_ROUTE}/${firstCommentId}`)
						.then((r) => {

							const data2 = r.body.data;
							expect(r.statusCode).toBe(SC.STATUS_OK);
							expect(data2).toEqual({ ...commentsArray[0], ...updateComment });
							done();

							// Testing for all the objects to match.
							// Actually only need to test if that one object was updated.
							// const data2 = r.body.data;
							// expect(r.statusCode).toBe(SC.STATUS_OK);

							// const comparisonArray = [...commentsArray];
							// comparisonArray[0] = {...commentsArray[0], ...updateComment};
							// expect(data2).toEqual(comparisonArray);
							// done();
						});
					});
		});
	});

	describe(`${DELETE_COMMENT_TEST_DESCRIPTION}`, () => {
		test('Server response should be a single object', (done) => {
			return request(app).delete(`${COMMENTS_ROUTE}/${firstCommentId}`)
				.then((res) => {
					const data = res.body.data;
					expect(res.statusCode).toBe(SC.STATUS_OK);
					expect(data).toEqual(commentsArray[0]);
					done();
				});
		});
		test(`Server response should be multiple objects in an array`, (done) => {
			return request(app).delete(`${COMMENTS_ROUTE}/${firstCommentId}`)
			.then((res) => {
				const data = res.body.data;
				expect(res.statusCode).toBe(SC.STATUS_OK);
				expect(data).toEqual(commentsArray[0]);
				
				return request(app).get(COMMENTS_ROUTE)
					.then((r) => {
						const data2 = r.body.data;
						expect(r.statusCode).toBe(SC.STATUS_OK);
						expect(Array.isArray(data2)).toBe(true);

						const comparisonArray = commentsArray.slice(1);
						expect(data2.length).toBe(comparisonArray.length);
						expect(data2).toEqual(comparisonArray);
						done();
					});
			});
		})
	});
});

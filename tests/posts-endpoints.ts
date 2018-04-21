require('../src/configs/processConfig');

process.env.NODE_ENV = 'test';

const request = require('supertest');

import mongoose from 'mongoose';
import Post from '../src/models/Post';
import { SC } from '../src/configs/statusCodes';

/**
 * Initialize server so that the app: express.Application can be configured properly.
 */
import server from './a';

/**
 * Get the app: express.Application.
 */
const app = server.getApp();

/**
 * Initialize description strings.
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
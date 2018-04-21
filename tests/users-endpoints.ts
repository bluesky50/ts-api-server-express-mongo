require('../src/configs/processConfig');

process.env.NODE_ENV = 'test';

const request = require('supertest');

import mongoose from 'mongoose';
import User from '../src/models/User';
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
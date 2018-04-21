// import { Request, Response } from 'express';
// import { handleServerError, handleInvalidInput } from '../helpers/responseHandlers';
// import { validateInput, validateMongoId } from '../helpers/validation';

// import IMongooseModelAdapter from '../interfaces/IMongooseModelAdapter';
// import { SC } from '../configs/statusCodes';

// // import User from '../models/User';
// import mongoose from 'mongoose';

// export default class MongooseModelAdapter<T extends mongoose.Document> implements IMongooseModelAdapter {
// 	private schema: object;
// 	private slug: string;
// 	private Model: mongoose.Model<T>;

// 	constructor(model: mongoose.Model<T>, validationSchema: object, slug: string) {
// 		// console.log(mongooseModel);
// 		this.schema = validationSchema;
// 		this.slug = slug;
// 		this.Model = model;
// 	}

// 	getObjects(req: Request, res: Response): void {
// 		// console.log(User);
// 		this.Model.find({})
// 			.then((data) => {
// 				res.status(SC.STATUS_OK);
// 				res.json({ status: SC.STATUS_OK, data });
// 			})
// 			.catch((err) => {
// 				handleServerError(res, err);
// 			});
// 	}

// 	getObject(req: Request, res: Response): void {
// 		const id = req.params[this.slug];

// 		console.log(this.Model);
// 		if (validateMongoId(id)) {
// 			this.Model.findById(id)
// 				.then((data) => {
// 					res.status(SC.STATUS_OK);
// 					res.json({ status: SC.STATUS_OK, data });
// 				})
// 				.catch((err) => {
// 					handleServerError(res, err);
// 				});
// 		} else {
// 			handleInvalidInput(res);
// 		}
// 	}

// 	createObject(req: Request, res: Response): void {
// 		console.log(this.Model);
// 		if(validateInput(req.body, this._dynamicSchema())) {
// 			const newObject = new this.Model(req.body);
// 			newObject.save()
// 				.then((data) => {
// 					res.status(SC.STATUS_OK);
// 					res.send({ status: SC.STATUS_OK, data });
// 				})
// 				.catch((err) => {
// 					handleServerError(res, err);
// 				});
// 			return;
// 		} else {
// 			handleInvalidInput(res);
// 		}
// 	}

// 	updateObject(req: Request, res: Response): void {
// 		const id = req.params[this.slug];
// 		const updateObj = req.body;

// 		console.log(this.Model);

// 		if (validateMongoId(id) && validateInput(updateObj, this.schema)) {
// 			this.Model.findByIdAndUpdate(id, updateObj, { new: true })
// 				.then((data) => {
// 					res.status(SC.STATUS_OK);
// 					res.json({ status: SC.STATUS_OK, data });
// 				})
// 				.catch((err) => {
// 					handleServerError(res, err);
// 				});
// 		} else {
// 			handleInvalidInput(res);
// 		}
// 	}

// 	deleteObject(req: Request, res: Response): void {
// 		const id = req.params[this.slug];

// 		console.log(this.Model);
// 		if (validateMongoId(id)) {
// 			this.Model.findByIdAndRemove(id)
// 				.then((data) => {
// 					res.status(SC.STATUS_OK);
// 					res.json({ status: SC.STATUS_OK, data });
// 				})
// 				.catch((err) => {
// 					handleServerError(res, err);
// 				});
// 		} else {
// 			handleInvalidInput(res);
// 		}
// 	}

// 	_dynamicSchema() {
// 		if (process.env.NODE_ENV === 'test' || process.env.ENV === 'test') {
// 			return { _id: 'id', ...this.schema };
// 		}
// 		return this.schema;
// 	}
// }
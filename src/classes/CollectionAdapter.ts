import mongoose from 'mongoose';
import ICollectionAdapter from '../interfaces/ICollectionAdapter';

import User from '../models/User';

/**
 * Mongoose collection adapter class
 */
export default class CollectionAdapter implements ICollectionAdapter {
	// private MongooseCollection: mongoose.Model<mongoose.Document>;
	private MongooseCollection: any;

	// constructor(mongooseModel: mongoose.Model<mongoose.Document>) {
	constructor(mongooseModel: any) {
		this.MongooseCollection = mongooseModel;
	}

	public getCollection() {
		return this.MongooseCollection;
	}

	public retrieve(populateConfig?: object | undefined, sortConfig?: object | undefined, limitConfig?: object | undefined) {
		// console.log('*** Retrive in CollectionAdapter');
		// console.log('*** this.MongooseCollection ***');
		// console.log(this.MongooseCollection);
		// console.log('*** USER ***');
		// console.log(User);
		const mongooseQuery: any = this.MongooseCollection.find();

		if (populateConfig) mongooseQuery.populate(populateConfig);
		if (sortConfig) mongooseQuery.sort(sortConfig);
		if (limitConfig) mongooseQuery.limit(limitConfig);

		return mongooseQuery.exec(); // Returns a promise.
	}

	public find(queryConfig?: object | undefined, populateConfig?: object | undefined, sortConfig?: object | undefined, limitConfig?: object | undefined) {
		let mongooseQuery: any;
		
		if (queryConfig) mongooseQuery = this.MongooseCollection.find(queryConfig);
		else mongooseQuery = this.MongooseCollection.find();
		if (populateConfig) mongooseQuery.populate(populateConfig);
		if (sortConfig) mongooseQuery.sort(sortConfig);
		if (limitConfig) mongooseQuery.limit(limitConfig);
		
		return mongooseQuery.exec(); // Returns a promise.
	}

	public findById(id: string, populateConfig: object | undefined) {
		const mongooseQuery = this.MongooseCollection.findById(id)

		if (populateConfig) mongooseQuery.populate(populateConfig);

		return mongooseQuery.exec();
	}

	public findOne(queryConfig?: object | undefined, populateConfig?: object | undefined){
		let mongooseQuery;
		
		if (queryConfig) mongooseQuery = this.MongooseCollection.find(queryConfig);
		else mongooseQuery = this.MongooseCollection.find();
		if (populateConfig) mongooseQuery.populate(populateConfig);

		return mongooseQuery.exec();
	}

	public create(item: object) {
		const newItem = new this.MongooseCollection(item);
		return newItem.save();
	}
	
	public updateById(id: string, item: any, populateConfig?: object | undefined) {
		const mongooseQuery = this.MongooseCollection.findByIdAndUpdate(id, item, { new: true });
		
		if (populateConfig) mongooseQuery.populate(populateConfig);
		
		return mongooseQuery.exec();
	}

	public removeById(id: string, populateConfig?: object | undefined) {
		const mongooseQuery = this.MongooseCollection.findByIdAndRemove(id)
		
		if (populateConfig) mongooseQuery.populate(populateConfig);

		return mongooseQuery.exec();
	}
}
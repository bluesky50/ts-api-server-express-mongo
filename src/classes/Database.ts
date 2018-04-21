import mongoose from 'mongoose';

import serverConfig from '../configs/serverConfig';

const debug = require('debug')(`${serverConfig.appName}:server`);

import IDatabase from '../interfaces/IDatabase';

/**
 * Implements a connection to that Mongo database.
 */
class Database implements IDatabase {
	private dbUri: string;
	private dbName: string;
	private connection: any;

	constructor(uri: any, dbName: string) {
		this.dbUri = uri;
		this.dbName = dbName;
	}

	connect() {
		mongoose.Promise = global.Promise;
		this.connection = mongoose.connect(this.dbUri + this.dbName);
		debug(`Connected to ${this.dbUri}`);
	}

	getConnection() {
		return this.connection;
	}

	closeConnection() {
		mongoose.disconnect();
	}
}

export default Database;
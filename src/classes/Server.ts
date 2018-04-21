import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';

import Database from './Database';
import serverConfig from '../configs/serverConfig';
import initializeDefaultRoutes from '../helpers/initializeDefaultRoutes';
import initializeRouteEndpoints from '../helpers/initializeRouteEndpoints';
import { normalizePort, onError, onListening } from '../helpers/serverHelpers';

const debug = require('debug')(`${serverConfig.appName}:server`);

import IServer from '../interfaces/IServer';

export default class Server implements IServer {
	private serverConfig;
	private routesConfig;
	private database;
	private app: express.Application;
	
	constructor(serverConfig: object, routesConfig?: object | undefined, app?: any | undefined, db?: any | undefined) {
		this.serverConfig = serverConfig;
		this.routesConfig = routesConfig;
		this.database = db;
		this.app = app;
	}

	public getApp() {
		return this.app;
	}

	public disconnectDB() {
		this.database.closeConnection();
	}

	public run() {
		this._pre();
		if (process.env.NODE_ENV !== 'test' || this.serverConfig.env !== 'test') this._start();
		if (process.env.NODE_ENV !== 'test' || this.serverConfig.env !== 'test') this._post();
	}

	private _pre() {
		debug('Pre sequence...');
		this._initializeApp();
		this._initializeRoutes();
		this._initializeDatabase();
	}

	private _start() {
		debug('Start sequence...');
		// Initialize port
		const port = normalizePort(process.env.PORT || this.serverConfig.port);
		this.app.set('port', port);

		// Create HTTP server.
		const server = http.createServer(this.app);
		server.on('error', onError(port));
		server.on('listening', onListening(server));

		// Listen on provided port, on all network interfaces.
		server.listen(port);
	}

	private _post() {
		debug('Post sequence...');
	}

	private _initializeApp() {
		debug('Initializing app');
		if (this.app === undefined || this.app === null) {
			this.app = express();

			this.app.use(bodyParser.urlencoded({ extended: true }));
			this.app.use(bodyParser.json());
			this.app.use(logger('dev'));
			this.app.use(helmet());
			this.app.use(cors());
			
			// Configure cors middleware
			this.app.use((req, res, next) => {
				res.header('Access-Control-Allow-Origin', '*');
				res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
				res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
				res.header('Access-Control-Allow-Credentials', 'true');
				next();
			});
		}
	}

	private _initializeRoutes() {
		debug('Initializing routes');
		// Setup Routes
		if (this.routesConfig === undefined || this.routesConfig === null) {
			initializeDefaultRoutes(this.app);
		} else {
			for (let key in this.routesConfig) {
				// console.log(key);
				initializeRouteEndpoints(this.app, this.routesConfig[key]);
			}
		}
	}

	private _initializeDatabase() {
		debug('Initializing database');
		if (this.database === undefined || this.database === null) {
			if (process.env.NODE_ENV == 'test' || this.serverConfig.env == 'test') {
				this.database = new Database(process.env.DB_URI, `${this.serverConfig.appName}-test`);
			} else {
				this.database = new Database(process.env.DB_URI, this.serverConfig.appName);
			}
		}

		// Connect to database.
		this.database.connect();
	}
}
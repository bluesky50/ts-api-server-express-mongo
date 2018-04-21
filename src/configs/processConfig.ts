import serverConfig from './serverConfig';

const env = process.env.NODE_ENV || serverConfig.env;

const processConfig = {
	'PORT': serverConfig.port,
	'DB_URI': serverConfig.dbUri,
	'NODE_ENV': serverConfig.env
}

if (env === 'test' || env === 'dev') {
	Object.keys(processConfig).forEach((k) => {
		process.env[k] = processConfig[k];
	});
}
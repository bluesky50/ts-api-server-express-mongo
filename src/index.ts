require('./configs/processConfig');

import Server from './classes/server';

import serverConfig from './configs/serverConfig';
import routesConfig from './configs/routesConfig';

const server = new Server(serverConfig, routesConfig, undefined, undefined);

server.run();
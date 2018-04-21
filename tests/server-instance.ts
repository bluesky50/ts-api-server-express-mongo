/**
 * Initialize server so that the app: express.Application can be configured properly.
 */
import Server from '../src/classes/TestServer';
import serverConfig from '../src/configs/serverConfig';
import routesConfig from '../src/configs/routesConfig';
import { SC } from '../src/configs/statusCodes';

const server = new Server(serverConfig, routesConfig, undefined, undefined);
server.run();

export default server;
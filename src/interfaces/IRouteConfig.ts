import IController from './IController';

interface IRouteConfig {
	route: string;
	controller: IController;
	type: 'standard' | 'custom';
	useBuilder: boolean;
	builder: any;
}

export default IRouteConfig
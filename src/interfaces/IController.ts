import { Request, Response } from 'express';

interface IController {
	getCollectionAdapter(): any;
	retrieveAll(req: Request, res: Response): void;
	retrieve(req: Request, res: Response): void;
	retrieveById(req: Request, res: Response): void;
	createOne(req: Request, res: Response): void;
	// createMany(req: Request, res: Response): void;
	updateById(req: Request, res: Response): void;
	deleteById(req: Request, res: Response): void;
}

export default IController;
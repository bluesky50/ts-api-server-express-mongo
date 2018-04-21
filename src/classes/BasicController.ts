import { Request, Response } from 'express';
import { handleServerError, handleInvalidInput } from '../helpers/responseHandlers';
import { validateInput, validateMongoId } from '../helpers/validation';

import IController from '../interfaces/IController';
import ICollectionAdapter from '../interfaces/ICollectionAdapter';
import { SC } from '../configs/statusCodes';

// TODO: Implement to handle req.body { data, options }.
/**
 * Controller class. The controller is used by the routerBuilder function to create an express Routers.
 */
export default class BasicController implements IController {
	private validationSchema: object;
	private collectionAdapter: ICollectionAdapter;

	constructor(collectionAdapter: ICollectionAdapter, validationSchema: object) {
		this.validationSchema = validationSchema;
		this.collectionAdapter = collectionAdapter;
		this.getCollectionAdapter = this.getCollectionAdapter.bind(this);
		this.retrieveAll = this.retrieveAll.bind(this);
		this.retrieve = this.retrieve.bind(this);
		this.retrieveById = this.retrieveById.bind(this);
		this.createOne = this.createOne.bind(this);
		this.updateById = this.updateById.bind(this);
		this.deleteById = this.deleteById.bind(this);
	}

	public getCollectionAdapter() {
		return this.collectionAdapter;
	}

	public retrieveAll(req: Request, res: Response): void {
		this.collectionAdapter.retrieve(undefined, undefined, undefined) // Route body not structured to implement.: populateConfig, sortConfig, limitConfig
			.then((data) => {
				res.status(SC.STATUS_OK);
				res.json({ status: SC.STATUS_OK, data });
			})
			.catch((err) => {
				handleServerError(res, err);
			});
	}

	public retrieve(req: Request, res: Response): void {
		this.collectionAdapter.find(undefined, undefined, undefined, undefined) // Route body not structured to implement: queryConfig, populateConfig, sortConfig, limitConfig
			.then((data) => {
				res.status(SC.STATUS_OK);
				res.json({ status: SC.STATUS_OK, data });
			})
			.catch((err) => {
				handleServerError(res, err);
			});
	}

	public retrieveById(req: Request, res: Response): void {
		const id = req.params.id;

		if (validateMongoId(id)) {
			this.collectionAdapter.findById(id, undefined) // Route body not structured to implement: id, populateConfig.
				.then((data) => {
					res.status(SC.STATUS_OK);
					res.json({ status: SC.STATUS_OK, data });
				})
				.catch((err) => {
					handleServerError(res, err);
				});
		} else {
			handleInvalidInput(res);
		}
	}

	public createOne(req: Request, res: Response): void {
		const newItem = req.body; 

		if(validateInput(newItem, this._dynamicSchema())) {
			this.collectionAdapter.create(newItem)
				.then((data) => {
					res.status(SC.STATUS_OK);
					res.send({ status: SC.STATUS_OK, data });
				})
				.catch((err) => {
					handleServerError(res, err);
				});
			return;
		} else {
			handleInvalidInput(res);
		}
	}

	public updateById(req: Request, res: Response): void {
		const id = req.params.id;
		const updateItem = req.body;

		if (validateMongoId(id) && validateInput(updateItem, this.validationSchema)) {
			this.collectionAdapter.updateById(id, updateItem, undefined) // Route body not structured to implement: id, updateItem, populateConfig.
				.then((data) => {
					res.status(SC.STATUS_OK);
					res.json({ status: SC.STATUS_OK, data });
				})
				.catch((err) => {
					handleServerError(res, err);
				});
		} else {
			handleInvalidInput(res);
		}
	}

	public deleteById(req: Request, res: Response): void {
		const id = req.params.id;

		if (validateMongoId(id)) {
			this.collectionAdapter.removeById(id, undefined) // Route body not structured to implement: id, populateConfig.
				.then((data) => {
					res.status(SC.STATUS_OK);
					res.json({ status: SC.STATUS_OK, data });
				})
				.catch((err) => {
					handleServerError(res, err);
				});
		} else {
			handleInvalidInput(res);
		}
	}

	private _dynamicSchema() {
		if (process.env.NODE_ENV === 'test' || process.env.ENV === 'test') {
			return { _id: 'id', ...this.validationSchema };
		}
		return this.validationSchema;
	}
}
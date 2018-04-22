import { Response } from 'express';

/**
 * A function that sense a response if the req.body is invalid.
 * @param res 
 */
export function handleInvalidInput(res: Response): void {
	res.status(Codes.STATUS_UNPROCESSABLE_ENTITY);
	res.json({ status: Codes.STATUS_UNPROCESSABLE_ENTITY, message: 'Invalid request body' });
}

/**
 * A function that sends a response if there is an error requesting data from the database.
 * @param res 
 * @param err 
 */
export function handleServerError(res: Response, err): void {
	res.status(Codes.STATUS_SERVER_ERROR);
	res.json({ status: Codes.STATUS_SERVER_ERROR, message: err.message });
}
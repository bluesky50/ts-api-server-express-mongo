import { Response } from 'express';

export function handleInvalidInput(res: Response): void {
	res.status(Codes.STATUS_UNPROCESSABLE_ENTITY);
	res.json({ status: Codes.STATUS_UNPROCESSABLE_ENTITY, message: 'Invalid request body' });
}

export function handleServerError(res: Response, err): void {
	res.status(Codes.STATUS_SERVER_ERROR);
	res.json({ status: Codes.STATUS_SERVER_ERROR, message: err.message });
}
import 'colors'

import {NextFunction, Request, Response} from 'express'
import httpError from '../exceptions/HttpError'

export const httpErrorMiddleware = (err: Error, _req: Request, res: Response, next: NextFunction) => {
	console.error('[ERROR]'.red.bold, err.message)

	if (err instanceof httpError) {
		res.status(err.status).json({message: err.message})
	} else {
		res.status(500).json({message: 'unexpected error'})
	}

	next()
}

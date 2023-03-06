import {NextFunction, Request, Response} from 'express'
import httpError from '../exceptions/HttpError'
import {Logger} from '../utils/Logger'

export const httpErrorMiddleware = (err: Error, _req: Request, res: Response, next: NextFunction) => {
	new Logger().error(err)

	if (err instanceof httpError) {
		res.status(err.status).json({message: err.message})
	} else {
		res.status(500).json({message: 'unexpected error'})
	}

	next()
}

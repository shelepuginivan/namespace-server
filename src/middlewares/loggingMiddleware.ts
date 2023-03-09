import {NextFunction, Request, RequestHandler, Response} from 'express'

import {Logger} from '../utils/Logger'

export const loggingMiddleware: RequestHandler = (req: Request, _res: Response, next: NextFunction): void => {
	new Logger().request(req)
	next()
}

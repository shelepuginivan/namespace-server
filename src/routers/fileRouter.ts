import {NextFunction, Request, Response, Router} from 'express'
import {fileController} from '../modules/fileModule'

const fileRouter: Router = Router()

fileRouter.get('/preview',
	(req: Request, res: Response, next: NextFunction) => fileController.previewFile(req, res, next))
fileRouter.get('/',
	(req: Request, res: Response, next: NextFunction) => fileController.downloadFile(req, res, next))
fileRouter.post('/',
	(req: Request, res: Response, next: NextFunction) => fileController.uploadFiles(req,  res, next))

export default fileRouter

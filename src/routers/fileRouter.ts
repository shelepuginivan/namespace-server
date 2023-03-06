import {NextFunction, Request, Response, Router} from 'express'

import {FileController} from '../controllers/FileController'
import {fileService} from '../modules/fileModule'

const fileRouter: Router = Router()
const fileController: FileController = new FileController(fileService)

fileRouter.get('/preview',
	(req: Request, res: Response, next: NextFunction) => fileController.previewFile(req, res, next))
fileRouter.get('/',
	(req: Request, res: Response, next: NextFunction) => fileController.downloadFile(req, res, next))
fileRouter.post('/',
	(req: Request, res: Response, next: NextFunction) => fileController.uploadFiles(req,  res, next))

export default fileRouter

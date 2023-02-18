import {Router} from 'express'
import FileController from '../controllers/FileController'

const fileRouter: Router = Router()

fileRouter.get('/preview', FileController.previewFile)
fileRouter.get('/', FileController.downloadFile)

export default fileRouter

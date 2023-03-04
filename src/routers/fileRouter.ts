import {Router} from 'express'
import {fileController} from '../modules/fileModule'

const fileRouter: Router = Router()

fileRouter.get('/preview', fileController.previewFile)
fileRouter.get('/', fileController.downloadFile)
fileRouter.post('/', fileController.uploadFiles)

export default fileRouter

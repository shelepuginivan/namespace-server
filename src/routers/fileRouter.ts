import {Router} from 'express'
import FileController from '../controllers/FileController'

const fileRouter: Router = Router()

fileRouter.get('/:path', FileController.downloadFile)

export default fileRouter

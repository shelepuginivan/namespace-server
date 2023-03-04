import {FileService} from '../services/FileService'
import {FileController} from '../controllers/FileController'
import {Listener} from '../listeners/Listener'

const fileService: FileService = new FileService()
export const fileController: FileController = new FileController(fileService)
export const listener: Listener = new Listener(fileService)

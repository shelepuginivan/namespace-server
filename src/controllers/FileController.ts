import {IFileController} from '../utils/interfaces/IFileController'
import {Request, Response} from 'express'
import FileService from '../services/FileService'

class FileController implements IFileController {
	downloadFile(req: Request, res: Response) {
		const pathToFile: string = req.params.path
		const absolutePath = FileService.downloadFile(pathToFile)
		res.download(absolutePath)
	}
}

export default new FileController()

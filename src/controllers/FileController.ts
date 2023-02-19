import {IFileController} from '../utils/interfaces/IFileController'
import {Request, Response} from 'express'
import FileService from '../services/FileService'
import mime from 'mime-types'
import fileUpload from 'express-fileupload'

class FileController implements IFileController {
	downloadFile(req: Request, res: Response) {
		const pathToFile: string = req.query.path as string
		const absolutePath = FileService.getAbsolutePathToFile(pathToFile)
		res.download(absolutePath)
	}

	previewFile(req: Request, res: Response) {
		const pathToFile: string = req.query.path as string
		const absolutePath = FileService.getAbsolutePathToFile(pathToFile)
		res.setHeader('Content-Type', `${mime.lookup(absolutePath) || 'text/plain'}; charset=utf-8`)
		res.status(200).sendFile(absolutePath)
	}

	async uploadFiles(req: Request, res: Response) {
		await FileService.uploadFiles(req.files as fileUpload.FileArray)

		res.status(200)
	}
}

export default new FileController()

import {IFileController} from '../utils/interfaces/IFileController'
import {NextFunction, Request, Response} from 'express'
import {FileService} from '../services/FileService'
import mime from 'mime-types'
import fileUpload from 'express-fileupload'

export class FileController implements IFileController {
	private readonly _fileService: FileService

	constructor(fileService: FileService) {
		this._fileService = fileService
	}
	downloadFile(req: Request, res: Response, next: NextFunction) {
		try {
			const pathToFile: string = req.query.path as string
			const absolutePath = this._fileService.getAbsolutePathToItem(pathToFile)
			res.download(absolutePath)
		} catch (e) {
			next(e)
		}
	}

	previewFile(req: Request, res: Response, next: NextFunction) {
		try {
			const pathToFile: string = req.query.path as string
			const absolutePath = this._fileService.getAbsolutePathToItem(pathToFile)
			res.setHeader('Content-Type', `${mime.lookup(absolutePath) || 'text/plain'}; charset=utf-8`)
			res.status(200).sendFile(absolutePath)
		} catch (e) {
			next(e)
		}
	}

	async uploadFiles(req: Request, res: Response, next: NextFunction) {
		try {
			await this._fileService.uploadFiles(req.files as fileUpload.FileArray)
			res.status(200).end()
		} catch (e) {
			next(e)
		}
	}
}

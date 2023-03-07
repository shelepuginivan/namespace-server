import {NextFunction, Request, Response} from 'express'
import fileUpload from 'express-fileupload'
import mime from 'mime-types'

import {FileService} from '../services/FileService'
import {IFileController} from '../utils/interfaces/IFileController'

export class FileController implements IFileController {
	constructor(private readonly _fileService: FileService) {}

	downloadFile(req: Request, res: Response, next: NextFunction) {
		try {
			const pathToFile: string = req.query.path as string
			const absolutePath = this._fileService.getAbsolutePathToItem(pathToFile)

			this._fileService.validatePath(absolutePath)

			res.download(absolutePath)
		} catch (e) {
			next(e)
		}
	}

	previewFile(req: Request, res: Response, next: NextFunction) {
		try {
			const pathToFile: string = req.query.path as string
			const absolutePath = this._fileService.getAbsolutePathToItem(pathToFile)

			this._fileService.validatePath(absolutePath)

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

import {NextFunction, Request, Response} from 'express'

export interface IFileController {
	downloadFile(req: Request, res: Response, next: NextFunction): void
	previewFile(req: Request, res: Response, next: NextFunction): void
	uploadFiles(req: Request, res: Response, next: NextFunction): void
}

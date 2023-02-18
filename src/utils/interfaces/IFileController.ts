import {Request, Response} from 'express'

export interface IFileController {
	downloadFile(req: Request, res: Response): void
}

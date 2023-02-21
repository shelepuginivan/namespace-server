import fileUpload from 'express-fileupload'

export interface IFileService {
	getAbsolutePathToItem(itemPath: string): string
	getItemDirectory(itemPath: string): string
	deleteItem(itemPath: string): Promise<void>
	uploadFiles(files: fileUpload.FileArray): Promise<void>
}

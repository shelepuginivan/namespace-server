import fileUpload from 'express-fileupload'

export interface IFileService {
	getAbsolutePathToItem(itemPath: string): string
	getItemDirectory(itemPath: string): string
	deleteItem(itemPath: string): Promise<void>
	createDirectory(newDirectory: string): Promise<void>
	uploadFiles(files: fileUpload.FileArray): Promise<void>
	renameItem(itemToRename: string, newName: string): Promise<void>
	validatePath(itemPath: string): void
}

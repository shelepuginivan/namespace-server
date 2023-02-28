import {IFileService} from '../utils/interfaces/IFileService'
import * as path from 'path'
import * as fs from 'fs'
import fsPromises from 'fs/promises'
import fileUpload from 'express-fileupload'
import FileSystemItem from '../FileSystemItem'
import HttpErrorFabric from '../exceptions/HttpErrorFabric'

class FileService implements IFileService {
	getAbsolutePathToItem(itemPath: string): string {
		return path.join(process.env.DISKSPACE_DIRECTORY as string, itemPath)
	}

	getItemDirectory(itemPath: string): string {
		const itemPathElements = itemPath.split('/')
		itemPathElements.pop()
		return itemPathElements.join('/') || '.'
	}

	async getItemsInDirectory(directory: string): Promise<FileSystemItem[]> {
		if (!path.isAbsolute(directory)) {
			directory = this.getAbsolutePathToItem(directory)
		}

		const workingDirectoryItems = await fsPromises.readdir(directory)
		return workingDirectoryItems.map(item => {
			const absolutePath = path.join(directory, item)
			return new FileSystemItem(absolutePath)
		})
	}


	async deleteItem(itemPath: string): Promise<void> {
		if (!fs.existsSync(itemPath)) {
			throw HttpErrorFabric.createBadRequest('file not found')
		}

		if (!path.isAbsolute(itemPath)) {
			itemPath = this.getAbsolutePathToItem(itemPath)
		}

		const itemData = await fs.stat(itemPath)

		await (itemData.isFile() ? fs.rm(itemPath) : fs.rmdir(itemPath))
	}

	async uploadFiles(files: fileUpload.FileArray): Promise<void> {
		if (!files) return

		Object.keys(files).forEach(pathToFile => {
			(files[pathToFile] as fileUpload.UploadedFile).mv(this.getAbsolutePathToItem(Buffer.from(pathToFile, 'latin1').toString('utf-8')))
		})
	}

	async renameItem(itemToRename: string, newName: string): Promise<void> {
		const oldAbsoluteItemPath = this.getAbsolutePathToItem(itemToRename)
		const newAbsoluteItemPath = this.getAbsolutePathToItem(newName)
		await fsPromises.rename(oldAbsoluteItemPath, newAbsoluteItemPath)
	}
}

export default new FileService()

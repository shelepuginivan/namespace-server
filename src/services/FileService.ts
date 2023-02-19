import {IFileService} from '../utils/interfaces/IFileService'
import * as path from 'path'
import * as fs from 'fs/promises'
import fileUpload from 'express-fileupload'

class FileService implements IFileService {
	getAbsolutePathToItem(itemPath: string): string {
		return path.join(process.env.DISKSPACE_DIRECTORY as string, itemPath)
	}

	getItemDirectory(itemPath: string): string {
		const itemPathElements = itemPath.split('/')
		itemPathElements.pop()
		return itemPathElements.join('/') || '/'
	}

	async deleteItem(itemPath: string): Promise<void> {
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
}

export default new FileService()

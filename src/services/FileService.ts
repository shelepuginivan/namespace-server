import {IFileService} from '../utils/interfaces/IFileService'
import * as path from 'path'
import * as fs from 'fs/promises'
import fileUpload from 'express-fileupload'

class FileService implements IFileService {
	getAbsolutePathToFile(pathToFile: string): string {
		return path.join(process.env.DISKSPACE_DIRECTORY as string, pathToFile)
	}

	async deleteItem(itemPath: string): Promise<void> {
		if (!path.isAbsolute(itemPath)) {
			itemPath = this.getAbsolutePathToFile(itemPath)
		}
		await fs.rm(itemPath)
	}

	async uploadFiles(files: fileUpload.FileArray) {
		Object.keys(files).forEach(pathToFile => {
			(files[pathToFile] as fileUpload.UploadedFile).mv(this.getAbsolutePathToFile(pathToFile))
		})
	}
}

export default new FileService()

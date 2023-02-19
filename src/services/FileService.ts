import {IFileService} from '../utils/interfaces/IFileService'
import * as path from 'path'
import * as fs from 'fs/promises'
import {resolveAbsoluteDiskSpacePath} from '../utils/resolveAbsoluteDiskSpacePath'

class FileService implements IFileService {
	getAbsolutePathToFile(pathToFile: string): string {
		return path.join(process.env.DISKSPACE_DIRECTORY as string, pathToFile)
	}

	async deleteItem(itemPath: string): Promise<void> {
		if (!path.isAbsolute(itemPath)) {
			itemPath = resolveAbsoluteDiskSpacePath(itemPath)
		}
		await fs.rm(itemPath)
	}
}

export default new FileService()

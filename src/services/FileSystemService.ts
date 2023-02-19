import {IFileSystemService} from '../utils/interfaces/IFileSystemService'
import * as path from 'path'
import * as fs from 'fs/promises'
import FileSystemItem from '../FileSystemItem'

class FileSystemService implements IFileSystemService {
	async getFilesInDirectory(directory: string): Promise<FileSystemItem[]> {
		const workingDirectoryItems = await fs.readdir(directory)
		return workingDirectoryItems.map(item => {
			const absolutePath = path.join(directory, item)
			return new FileSystemItem(absolutePath)
		})
	}
}

export default new FileSystemService()

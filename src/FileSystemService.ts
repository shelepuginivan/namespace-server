import {IFileSystemService} from './utils/interfaces/IFileSystemService'
import * as path from 'path'
import * as fs from 'fs/promises'
import FileSystemItem from './FileSystemItem'
import {IFileSystemItem} from './utils/interfaces/IFileSystemItem'

class FileSystemService implements IFileSystemService {
	private readonly root: string = process.env.DISKSPACE_DIRECTORY as string
	private currentWorkingDirectory: string

	constructor() {
		this.currentWorkingDirectory = this.root
	}

	set workingDirectory(dir: string) {
		this.currentWorkingDirectory = path.join(this.root, dir)
	}

	get workingDirectory(): string {
		return this.currentWorkingDirectory
	}

	async getFilesInWorkingDirectory(): Promise<FileSystemItem[]> {
		const workingDirectoryItems = await fs.readdir(this.workingDirectory)
		return workingDirectoryItems.map(item => {
			const itemProps: IFileSystemItem = {
				name: item,
				path: (item === '/' ? '' : '/') + path.join(this.workingDirectory.replace(this.root, ''), item).replace(/\\/g, '/'),
				extension: path.extname(item),
				isDirectory: path.extname(item) === ''
			}

			return new FileSystemItem(itemProps)
		})
	}
}

export default FileSystemService

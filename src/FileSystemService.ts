import {IFileSystemService} from './utils/interfaces/IFileSystemService'
import * as path from 'path'
import * as fs from 'fs/promises'
import FileSystemItem from "./FileSystemItem";
import {IFileSystemItem} from "./utils/interfaces/IFileSystemItem";

class FileSystemService implements IFileSystemService {
	private currentWorkingDirectory: string

	constructor() {
		this.currentWorkingDirectory = path.join(process.env.DISKSPACE_DIRECTORY as string)
	}

	set workingDirectory(dir: string) {
		this.currentWorkingDirectory = path.join((process.env.DISKSPACE_DIRECTORY as string), dir)
	}

	get workingDirectory(): string {
		return this.currentWorkingDirectory
	}

	async getFilesInWorkingDirectory(): Promise<FileSystemItem[]> {
		const workingDirectoryItems = await fs.readdir(this.workingDirectory)
		return workingDirectoryItems.map(item => {
			const itemProps: IFileSystemItem = {
				name: item,
				path: path.join(this.workingDirectory, item),
				extension: path.extname(item),
				isDirectory: path.extname(item) === ''
			}

			return new FileSystemItem(itemProps)
		})
	}
}

export default FileSystemService

import {IFileSystemService} from './utils/interfaces/IFileSystemService'
import * as path from 'path'

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
}

export default FileSystemService

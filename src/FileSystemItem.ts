import {IFileSystemItem} from './utils/interfaces/IFileSystemItem'
import mime from 'mime-types'
import fs from 'fs'
import path from 'path'

class FileSystemItem implements IFileSystemItem {
	extension: string | null
	isDirectory: boolean
	name: string
	path: string
	mimetype: string
	size: number

	constructor (absolutePath: string, currentDirectory: string) {
		const fileStats = fs.statSync(absolutePath)

		this.extension = path.extname(absolutePath)
		this.isDirectory = fileStats.isDirectory()
		this.name = path.basename(absolutePath)
		this.path = path.join(currentDirectory, this.name)
		this.mimetype = mime.lookup(this.name) || 'folder'
		this.size = fileStats.size
	}
}

export default FileSystemItem

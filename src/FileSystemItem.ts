import config from 'config'
import fs from 'fs'
import mime from 'mime-types'
import path from 'path'

import {IFileSystemItem} from './utils/interfaces/IFileSystemItem'

class FileSystemItem implements IFileSystemItem {
	extension: string | null
	isDirectory: boolean
	name: string
	path: string
	mimetype: string
	size: number

	constructor (absolutePath: string) {
		const fileStats = fs.statSync(absolutePath)

		this.extension = path.extname(absolutePath)
		this.isDirectory = fileStats.isDirectory()
		this.name = path.basename(absolutePath)
		this.path = absolutePath.replace(config.get('cloudDirectory'), '').replace(/\\/g, '/')
		this.mimetype = mime.lookup(this.name) || ''
		this.size = fileStats.size
	}
}

export default FileSystemItem

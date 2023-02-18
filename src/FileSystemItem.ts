import {IFileSystemItem} from './utils/interfaces/IFileSystemItem'

class FileSystemItem implements IFileSystemItem {
	extension: string | null
	isDirectory: boolean
	name: string
	path: string

	constructor (props: IFileSystemItem) {
		this.extension = props.extension
		this.isDirectory = props.isDirectory
		this.name = props.name
		this.path = props.path
	}
}

export default FileSystemItem

export interface IFileSystemItem {
	name: string
	extension: string | null
	path: string
	mimetype: string
	size: number
	isDirectory: boolean
}

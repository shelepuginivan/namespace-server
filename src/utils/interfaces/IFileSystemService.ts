import FileSystemItem from '../../FileSystemItem'

export interface IFileSystemService {
	getFilesInDirectory(directory: string): Promise<FileSystemItem[]>
}

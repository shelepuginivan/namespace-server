import {IListener} from '../utils/interfaces/IListener'
import {DisconnectReason, Server, Socket} from 'socket.io'
import FileSystemItem from '../FileSystemItem'
import FileSystemService from '../services/FileSystemService'
import FileService from '../services/FileService'

class Listener implements IListener {
	private fileSystemService: FileSystemService

	constructor(fileSystemService: FileSystemService) {
		this.fileSystemService = fileSystemService
	}

	disconnect(socket: Socket, reason: DisconnectReason): void {
		console.log('[DISCONNECTED]'.red.bold, `${socket.id} - ${reason.toUpperCase()}`)
	}

	async changeDir(socket: Socket, newDirectory: string): Promise<void> {
		this.fileSystemService.workingDirectory = newDirectory.trim()
		const workingDirItems: FileSystemItem[] = await this.fileSystemService.getFilesInWorkingDirectory()

		socket.emit('updateDirItems', JSON.stringify(workingDirItems))
	}

	async deleteItem(io: Server, itemPath: string): Promise<void> {
		await FileService.deleteItem(itemPath)
		const updatedWorkingDirItems: FileSystemItem[] = await this.fileSystemService.getFilesInWorkingDirectory()

		io.sockets.emit('updateDirItems', JSON.stringify(updatedWorkingDirItems))
	}
}

export default Listener

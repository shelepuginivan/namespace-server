import {IListener} from '../utils/interfaces/IListener'
import {DisconnectReason, Server, Socket} from 'socket.io'
import FileSystemItem from '../FileSystemItem'
import FileSystemService from '../services/FileSystemService'
import FileService from '../services/FileService'
import * as path from 'path'

class Listener implements IListener {
	disconnect(socket: Socket, reason: DisconnectReason): void {
		console.log('[DISCONNECTED]'.red.bold, `${socket.id} - ${reason.toUpperCase()}`)
	}

	async changeDir(socket: Socket, newDirectory: string): Promise<void> {
		const workingDirItems: FileSystemItem[] = await FileSystemService.getFilesInDirectory(FileService.getAbsolutePathToItem(newDirectory))

		socket.emit('updateDirItems', JSON.stringify(workingDirItems))
	}

	async deleteItem(io: Server, itemPath: string): Promise<void> {
		await FileService.deleteItem(itemPath)
		const absoluteItemPath = FileService.getAbsolutePathToItem(itemPath)
		const updatedWorkingDirItems: FileSystemItem[] = await FileSystemService.getFilesInDirectory(path.dirname(absoluteItemPath))

		io.sockets.emit('updateDirItems', JSON.stringify(updatedWorkingDirItems))
	}
}

export default Listener

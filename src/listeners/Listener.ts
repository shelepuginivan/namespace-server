import {IListener} from '../utils/interfaces/IListener'
import {DisconnectReason, Socket} from 'socket.io'
import FileSystemItem from '../FileSystemItem'
import FileSystemService from '../services/FileSystemService'
import FileService from '../services/FileService'

class Listener implements IListener {
	disconnect(socket: Socket, reason: DisconnectReason): void {
		console.log('[DISCONNECTED]'.red.bold, `${socket.id} - ${reason.toUpperCase()}`)
	}

	async changeDir(socket: Socket, newDirectory: string): Promise<void> {
		socket.rooms.forEach(room => socket.leave(room))
		socket.join(newDirectory)
		const workingDirItems: FileSystemItem[] = await FileSystemService.getFilesInDirectory(FileService.getAbsolutePathToItem(newDirectory))

		socket.emit('updateDirItems', JSON.stringify(workingDirItems))
	}

	async deleteItem(socket: Socket, itemPath: string): Promise<void> {
		await FileService.deleteItem(itemPath)
		const relativeItemDirectory = FileService.getItemDirectory(itemPath)
		const absoluteItemPath = FileService.getAbsolutePathToItem(relativeItemDirectory)

		const updatedDirectoryItems = await FileSystemService.getFilesInDirectory(absoluteItemPath)

		socket.emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
		socket.to(relativeItemDirectory).emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
	}

	async updateItems(socket: Socket, directory: string) {
		const absoluteItemPath = FileService.getAbsolutePathToItem(directory)

		const updatedDirectoryItems = await FileSystemService.getFilesInDirectory(absoluteItemPath)

		socket.emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
		socket.to(directory).emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
	}
}

export default new Listener()

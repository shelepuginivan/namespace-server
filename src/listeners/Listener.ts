import {IListener} from '../utils/interfaces/IListener'
import {DisconnectReason, Socket} from 'socket.io'
import FileSystemItem from '../FileSystemItem'
import FileService from '../services/FileService'

class Listener implements IListener {
	connect(socket: Socket): void {
		const password = socket.handshake.auth?.password
		const presetPassword = process.env.DISKSPACE_PASSWORD

		if (presetPassword && password !== presetPassword) {
			console.error('[CONNECTION ERROR]'.red.bold, `${socket.id} - WRONG PASSWORD`)
			socket.disconnect(true)
			return
		}

		console.log('[CONNECTION]'.green.bold, `${socket.id} - ESTABLISHED`)
	}

	disconnect(socket: Socket, reason: DisconnectReason): void {
		console.error('[DISCONNECTED]'.red.bold, `${socket.id} - ${reason.toUpperCase()}`)
	}

	async changeDir(socket: Socket, newDirectory: string): Promise<void> {
		socket.rooms.forEach(room => socket.leave(room))
		socket.join(newDirectory)
		const workingDirItems: FileSystemItem[] = await FileService.getItemsInDirectory(FileService.getAbsolutePathToItem(newDirectory))

		socket.emit('updateDirItems', JSON.stringify(workingDirItems))
	}

	async deleteItem(socket: Socket, itemPath: string): Promise<void> {
		await FileService.deleteItem(itemPath)

		const relativeItemDirectory = FileService.getItemDirectory(itemPath)
		const updatedDirectoryItems = JSON.stringify(await FileService.getItemsInDirectory(relativeItemDirectory))

		socket.emit('updateDirItems', updatedDirectoryItems)
		socket.to(relativeItemDirectory).emit('updateDirItems', updatedDirectoryItems)
	}

	async renameItem(socket: Socket, oldPath: string, newPath: string) {
		await FileService.renameItem(oldPath, newPath)

		const oldRelativePath = FileService.getItemDirectory(oldPath)
		const newRelativePath = FileService.getItemDirectory(newPath)

		const itemsInOldDir = JSON.stringify(await FileService.getItemsInDirectory(oldRelativePath))
		const itemsInNewDir = JSON.stringify(await FileService.getItemsInDirectory(newRelativePath))

		socket.emit('updateDirItems', itemsInOldDir)
		socket.to(oldRelativePath).emit('updateDirItems', itemsInOldDir)
		socket.to(newRelativePath).emit('updateDirItems', itemsInNewDir)
	}

	async updateItems(socket: Socket, directory: string) {
		const absoluteItemPath = FileService.getAbsolutePathToItem(directory)

		const updatedDirectoryItems = await FileService.getItemsInDirectory(absoluteItemPath)

		socket.emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
		socket.to(directory).emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
	}

	error(socket: Socket, error: Error): void {
		console.error('[ERROR]'.red.bold, `${socket.id} - ${error.message}`)
	}
}

export default new Listener()

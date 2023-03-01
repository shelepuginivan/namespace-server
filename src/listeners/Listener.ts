import {IListener} from '../utils/interfaces/IListener'
import {DisconnectReason, Socket} from 'socket.io'
import FileSystemItem from '../FileSystemItem'
import FileService from '../services/FileService'

class Listener implements IListener {
	connect(socket: Socket): void {
		try {
			const password = socket.handshake.auth?.password
			const presetPassword = process.env.DISKSPACE_PASSWORD

			if (presetPassword && password !== presetPassword) {
				console.error('[CONNECTION ERROR]'.red.bold, `${socket.id} - WRONG PASSWORD`)
				socket.disconnect(true)
				return
			}

			console.log('[CONNECTION]'.green.bold, `${socket.id} - ESTABLISHED`)
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	disconnect(socket: Socket, reason: DisconnectReason): void {
		console.error('[DISCONNECTED]'.red.bold, `${socket.id} - ${reason.toUpperCase()}`)
	}

	async changeDir(socket: Socket, newDirectory: string): Promise<void> {
		try {
			socket.rooms.forEach(room => socket.leave(room))
			socket.join(newDirectory)
			const workingDirItems: FileSystemItem[] = await FileService.getItemsInDirectory(FileService.getAbsolutePathToItem(newDirectory))

			socket.emit('updateDirItems', JSON.stringify(workingDirItems))
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	async deleteItem(socket: Socket, itemPath: string): Promise<void> {
		try {
			await FileService.deleteItem(itemPath)

			const relativeItemDirectory = FileService.getItemDirectory(itemPath)
			const updatedDirectoryItems = JSON.stringify(await FileService.getItemsInDirectory(relativeItemDirectory))

			socket.emit('updateDirItems', updatedDirectoryItems)
			socket.to(relativeItemDirectory).emit('updateDirItems', updatedDirectoryItems)
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	async renameItem(socket: Socket, oldPath: string, newPath: string) {
		try {
			if (oldPath.startsWith('/')) oldPath = oldPath.replace('/', '')
			if (newPath.startsWith('/')) newPath = newPath.replace('/', '')

			await FileService.renameItem(oldPath, newPath)

			const oldRelativePath = FileService.getItemDirectory(oldPath)
			const newRelativePath = FileService.getItemDirectory(newPath)

			const itemsInOldDir = JSON.stringify(await FileService.getItemsInDirectory(oldRelativePath))
			const itemsInNewDir = JSON.stringify(await FileService.getItemsInDirectory(newRelativePath))

			socket.emit('updateDirItems', itemsInOldDir)
			socket.to(oldRelativePath).emit('updateDirItems', itemsInOldDir)
			socket.to(newRelativePath).emit('updateDirItems', itemsInNewDir)
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	async updateItems(socket: Socket, directory: string) {
		try {
			const absoluteItemPath = FileService.getAbsolutePathToItem(directory)

			const updatedDirectoryItems = await FileService.getItemsInDirectory(absoluteItemPath)

			socket.emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
			socket.to(directory).emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	error(socket: Socket, error: Error): void {
		console.error('[ERROR]'.red.bold, `${socket.id} - ${error.message}`)
	}
}

export default new Listener()

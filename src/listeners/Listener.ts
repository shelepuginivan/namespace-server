import {IListener} from '../utils/interfaces/IListener'
import {DisconnectReason, Socket} from 'socket.io'
import FileSystemItem from '../FileSystemItem'
import {FileService} from '../services/FileService'
import {Logger} from '../utils/Logger'

export class Listener implements IListener {
	constructor(
		private readonly _fileService: FileService,
		private readonly _logger: Logger
	) {}

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
			const workingDirItems: FileSystemItem[] = await this._fileService.getItemsInDirectory(this._fileService.getAbsolutePathToItem(newDirectory))

			socket.emit('updateDirItems', JSON.stringify(workingDirItems))
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	async createDirectory(socket: Socket, newDirectory: string): Promise<void> {
		try {
			const newDirectoryAbsolutePath = this._fileService.getAbsolutePathToItem(newDirectory)
			const newDirectoryAbsoluteLocation = this._fileService.getItemDirectory(newDirectoryAbsolutePath)
			const room = this._fileService.getItemDirectory(newDirectory)

			await this._fileService.createDirectory(newDirectoryAbsolutePath)

			const updatedFiles = JSON.stringify(await this._fileService.getItemsInDirectory(newDirectoryAbsoluteLocation))

			socket.emit('updateDirItems', updatedFiles)
			socket.to(room).emit('updateDirItems', updatedFiles)
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	async deleteItem(socket: Socket, itemPath: string): Promise<void> {
		try {
			await this._fileService.deleteItem(itemPath)

			const relativeItemDirectory = this._fileService.getItemDirectory(itemPath)
			const updatedDirectoryItems = JSON.stringify(await this._fileService.getItemsInDirectory(relativeItemDirectory))

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

			await this._fileService.renameItem(oldPath, newPath)

			const oldRelativePath = this._fileService.getItemDirectory(oldPath)
			const newRelativePath = this._fileService.getItemDirectory(newPath)

			const itemsInOldDir = JSON.stringify(await this._fileService.getItemsInDirectory(oldRelativePath))
			const itemsInNewDir = JSON.stringify(await this._fileService.getItemsInDirectory(newRelativePath))

			socket.emit('updateDirItems', itemsInOldDir)
			socket.to(oldRelativePath).emit('updateDirItems', itemsInOldDir)
			socket.to(newRelativePath).emit('updateDirItems', itemsInNewDir)
		} catch (e) {
			console.error('[ERROR]'.red.bold, (e as Error).message)
		}
	}

	async updateItems(socket: Socket, directory: string) {
		try {
			const absoluteItemPath = this._fileService.getAbsolutePathToItem(directory)

			const updatedDirectoryItems = await this._fileService.getItemsInDirectory(absoluteItemPath)

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

import config from 'config'
import {DisconnectReason, Socket} from 'socket.io'

import FileSystemItem from '../FileSystemItem'
import {FileService} from '../services/FileService'
import {IListener} from '../utils/interfaces/IListener'
import {Logger} from '../utils/Logger'
import {SocketErrorFactory} from '../exceptions/SocketErrorFactory'
import {SocketError} from '../exceptions/SocketError'

export class Listener implements IListener {
	constructor(
		private readonly _fileService: FileService,
		private readonly _logger: Logger
	) {}

	private readonly _handleError = (e: Error, socket: Socket) => {
		this._logger.error(e)
		if (!(e instanceof SocketError)) e = SocketErrorFactory.unexpectedError(e.message)

		socket.emit('error', JSON.stringify(e))
	}

	connect(socket: Socket): void {
		try {
			const password = socket.handshake.auth?.password
			const presetPassword = config.get('cloudPassword')

			if (presetPassword && password !== presetPassword) {
				this._logger.error(`AUTH ${socket.id} - WRONG PASSWORD`)
				socket.disconnect(true)
				return
			}

			this._logger.connection(`${socket.id} - ESTABLISHED`)
		} catch (e) {
			this._logger.error(e as Error)
		}
	}

	disconnect(socket: Socket, reason: DisconnectReason): void {
		this._logger.disconnection(`${socket.id} - ${reason.toUpperCase()}`)
	}

	async changeDir(socket: Socket, newDirectory: string): Promise<void> {
		try {
			socket.rooms.forEach(room => socket.leave(room))
			socket.join(newDirectory)

			const workingDirItems: FileSystemItem[] = await this._fileService.getItemsInDirectory(this._fileService.getAbsolutePathToItem(newDirectory))

			socket.emit('updateDirItems', JSON.stringify(workingDirItems))
		} catch (e) {
			this._logger.error(e as Error)
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
			this._logger.error(e as Error)
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
			this._logger.error(e as Error)
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
			this._logger.error(e as Error)
		}
	}

	async updateItems(socket: Socket, directory: string) {
		try {
			const absoluteItemPath = this._fileService.getAbsolutePathToItem(directory)

			const updatedDirectoryItems = await this._fileService.getItemsInDirectory(absoluteItemPath)

			socket.emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
			socket.to(directory).emit('updateDirItems', JSON.stringify(updatedDirectoryItems))
		} catch (e) {
			this._logger.error(e as Error)
		}
	}

	error(socket: Socket, error: Error): void {
		this._logger.error(`${socket.id} - ${error.message}`)
	}
}

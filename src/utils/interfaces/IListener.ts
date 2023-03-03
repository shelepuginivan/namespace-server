import {DisconnectReason, Socket} from 'socket.io'

export interface IListener {
	connect(socket: Socket): void
	changeDir(socket: Socket, newDirectory: string): Promise<void>
	createDirectory(socket: Socket, newDirectory: string): Promise<void>
	deleteItem(socket: Socket, itemPath: string): Promise<void>
	disconnect(socket: Socket, reason: DisconnectReason): void
	error(socket: Socket, error: Error): void
}

import {DisconnectReason, Server, Socket} from 'socket.io'

export interface IListener {
	disconnect(socket: Socket, reason: DisconnectReason): void
	changeDir(socket: Socket, newDirectory: string): Promise<void>
	deleteItem(io: Server, itemPath: string): Promise<void>
}

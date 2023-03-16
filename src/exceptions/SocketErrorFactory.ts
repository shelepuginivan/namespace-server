import {SocketError} from './SocketError'

export class SocketErrorFactory {
	static authError(message: string): SocketError {
		return new SocketError(message, 'auth')
	}

	static unexpectedError(message: string): SocketError {
		return new SocketError(message, 'unexpected')
	}
}

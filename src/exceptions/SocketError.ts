type SocketErrorType = 'auth' | 'unexpected'

export class SocketError extends Error {
	type: SocketErrorType

	constructor(message: string, type: SocketErrorType) {
		super()
		this.message = message
		this.type = type
	}
}

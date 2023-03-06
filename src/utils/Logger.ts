import 'colors'

import {ILogger} from './interfaces/ILogger'

export class Logger implements ILogger {
	private static _instance: Logger | undefined

	constructor() {
		if (!Logger._instance) Logger._instance = this
		return Logger._instance
	}

	error(e: Error): void {
		console.error(`[${new Date().toISOString()}]`.bold, '[ERROR]'.red.bold, e.message)
	}

	event(eventName: string, message: string): void {
		console.log(`[${new Date().toISOString()}]`.bold, `[${eventName}]`.green.bold, message)
	}

	fatal(e: Error): void {
		console.error(`[${new Date().toISOString()}]`.bold, '[FATAL]'.red.bold, e.message)
	}

	info(message: string): void {
		console.info(`[${new Date().toISOString()}]`.bold, '[INFO]'.blue.bold, message)
	}

	start(port: number): void {
		console.log(`[${new Date().toISOString()}]`.bold, '[START]'.magenta.bold, `Server started on port ${port}...`)
	}
}

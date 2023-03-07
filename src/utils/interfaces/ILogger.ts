import {Request} from 'express'

export interface ILogger {
	connection(message: string): void
	disconnection(message: string): void
	error(e: Error | string): void
	event(eventName: string, message: string): void
	fatal(e: Error): void
	info(message: string): void
	request(req: Request): void
	start(port: number): void
}

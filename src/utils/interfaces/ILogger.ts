export interface ILogger {
	error(e: Error): void
	event(eventName: string, message: string): void
	fatal(e: Error): void
	info(message: string): void
	start(port: number): void
}

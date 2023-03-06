import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fileUpload from 'express-fileupload'
import {createServer} from 'http'
import * as path from 'path'
import {Server} from 'socket.io'

import fileRouter from './routers/fileRouter'
import {httpErrorMiddleware} from './middlewares/httpErrorMiddleware'
import {fileService} from './modules/fileModule'
import {Logger} from './utils/Logger'
import {Listener} from './listeners/Listener'

dotenv.config({path: path.join(__dirname, '..', '.env')})

const origin: string[] = (process.env.CLIENTS || 'localhost').split(',')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {origin}
})

const logger = new Logger()
const listener: Listener = new Listener(fileService)

app.use('/files', cors({origin}))
app.use(fileUpload())
app.use('/files', fileRouter)
app.use(httpErrorMiddleware)

io.on('connection', (socket) => {
	listener.connect(socket)

	socket.on('changeDir', newDirectory => listener.changeDir(socket, newDirectory))
	socket.on('createDirectory', newDirectory => listener.createDirectory(socket, newDirectory))
	socket.on('deleteItem', itemPath => listener.deleteItem(socket, itemPath))
	socket.on('disconnect', reason => listener.disconnect(socket, reason))
	socket.on('renameItem', (itemToRename, newName) => listener.renameItem(socket, itemToRename, newName))
	socket.on('updateItems', async directory => listener.updateItems(socket, directory))
	socket.on('error', error => listener.error(socket, error))
})

try {
	const PORT = parseInt(process.env.PORT as string) || 5124
	httpServer.listen(PORT)

	logger.info(`CORS: Allowed origins: ${origin.join(', ')}`)
	logger.start(PORT)
} catch (e) {
	logger.fatal(e as Error)
}

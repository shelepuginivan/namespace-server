import config from 'config'
import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import {createServer} from 'http'
import {Server} from 'socket.io'

import {Listener} from './listeners/Listener'
import {httpErrorMiddleware} from './middlewares/httpErrorMiddleware'
import {fileService} from './modules/fileModule'
import fileRouter from './routers/fileRouter'
import {Logger} from './utils/Logger'

const origin: string[] = config.get('allowedClients')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {origin}
})

const logger = new Logger()
const listener: Listener = new Listener(fileService, logger)

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
	const PORT: number = config.get('port') || 5124
	httpServer.listen(PORT)

	logger.info(`CORS: Allowed origins: ${origin.join(', ')}`)
	logger.start(PORT)
} catch (e) {
	logger.fatal(e as Error)
}

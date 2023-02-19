import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import * as path from 'path'
import fileRouter from './routers/fileRouter'
import Listener from './listeners/Listener'
import 'colors'

dotenv.config({path: path.join(__dirname, '..', '.env')})

const origin: string[] = (process.env.CLIENTS || 'localhost').split(',')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {origin}
})

const listener: Listener = new Listener()

app.use('/files', cors({origin}))
app.use(fileUpload())
app.use('/files', fileRouter)

io.on('connection', (socket) => {
	console.log('[CONNECTION]'.green.bold, `${socket.id} - ESTABLISHED`)

	socket.on('changeDir', async newDirectory => listener.changeDir(socket, newDirectory))
	socket.on('deleteItem', async itemPath => listener.deleteItem(socket, itemPath))
	socket.on('updateItems', async directory => listener.updateItems(socket, directory))
	socket.on('disconnect', reason => listener.disconnect(socket, reason))
})

try {
	const PORT = process.env.PORT || 5124
	httpServer.listen(PORT)
	console.log('[CORS]'.blue.bold, `Allowed origins: ${origin.join(', ')}`)
	console.log('[START]'.blue.bold, `Server started on port ${PORT}...`)
	console.log(`\nPaste this URL in the input on client: http://127.0.0.1:${PORT}\n`)
} catch (e) {
	console.error('[STARTUP ERROR]'.red.bold, e)
}

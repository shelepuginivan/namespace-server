import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import FileSystemService from './services/FileSystemService'
import * as path from 'path'
import fileRouter from './routers/fileRouter'
import Listener from './listeners/Listener'
import 'colors'

dotenv.config({path: path.join(__dirname, '..', '.env')})

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: '*'
	}
})

const fileSystemService: FileSystemService = new FileSystemService()
const listener: Listener = new Listener(fileSystemService)

app.use(cors({
	origin: '*'
}))
app.use(fileUpload())
app.use('/files', fileRouter)

io.on('connection', (socket) => {
	console.log('[CONNECTION]'.green.bold, `${socket.id} - ESTABLISHED`)

	socket.on('changeDir', async newDirectory => listener.changeDir(socket, newDirectory))
	socket.on('deleteItem', async itemPath => listener.deleteItem(io, itemPath))
	socket.on('disconnect', reason => listener.disconnect(socket, reason))
})

try {
	const PORT = process.env.PORT || 5124
	httpServer.listen(PORT)
	console.log('[START]'.blue.bold, `Server started on port ${PORT}...`)
	console.log(`\nPaste this URL in the input on client: http://127.0.0.1:${PORT}\n`)
} catch (e) {
	console.error(e)
}

import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import FileSystemService from './FileSystemService'
import * as path from 'path'
import FileSystemItem from './FileSystemItem'
import fileRouter from './routers/fileRouter'

dotenv.config({path: path.join(__dirname, '..', '.env')})

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: '*'
	}
})

const fileSystemService: FileSystemService = new FileSystemService()

app.use(cors({
	origin: '*'
}))
app.use('/files', fileRouter)

io.on('connection', (socket) => {
	console.log(`Client ${socket.id} connected`)

	socket.on('changeDir', async newDir => {
		fileSystemService.workingDirectory = newDir.trim()
		const workingDirItems: FileSystemItem[] = await fileSystemService.getFilesInWorkingDirectory()

		socket.emit('updateDirItems', JSON.stringify(workingDirItems))
	})
})

try {
	const PORT = process.env.PORT || 5124
	httpServer.listen(PORT)
	console.log(`Server started on port ${PORT}...`)
	console.log(`\nPaste this URL in the input on client: http://127.0.0.1:${PORT}\n`)
} catch (e) {
	console.error(e)
}

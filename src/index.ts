import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import FileSystemService from './FileSystemService'
import * as path from "path";

dotenv.config({path: path.join(__dirname, '..', '.env')})

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	}
})

const fileSystemService: FileSystemService = new FileSystemService()

app.use(cors({
	origin: '*'
}))

io.on('connection', (socket) => {
	console.log(`Client ${socket.id} connected`)
	socket.on('changeDir', newDir => {
		fileSystemService.workingDirectory = newDir.trim()
		console.log(fileSystemService.workingDirectory)
	})
})

try {
	const PORT = process.env.PORT || 5124
	httpServer.listen(PORT)
	console.log(`Server started on port ${PORT}...`)
} catch (e) {
	console.error(e)
}

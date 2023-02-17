import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

io.on('connection', (socket) => console.log(`Client ${socket.id} connected`))

try {
	const PORT = process.env.PORT || 5124
	httpServer.listen(PORT)
	console.log(`Server started on port ${PORT}...`)
} catch (e) {
	console.error(e)
}

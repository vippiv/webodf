const port = 9526
const net = require('net')
const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')


function porIsOccupied(port, cb) {
	const server = net.createServer().listen(port)
	server.on('listening', () => {
		server.close()
		console.log(`The port ${port} is available`)
		cb(port)
	})
	server.on('error', (err) => {
		if (err.code === 'EDRRINUSE') {
			porIsOccupied(port++, cb)
			console.log(`The port ${port} is occupied, please change other port`)
		}
	})
}

function runServer(port) {
	const server = http.createServer((req, res) => {
		const pathName = url.parse(req.url).pathname
		const realPath = path.join(__dirname, pathName)

		console.log(realPath)

		fs.readFile(realPath, (err, data) => {
			if (err) {
				res.writeHead(404, {
					'content-type': 'text/plain'
				})
				res.write('404，页面不存在')
			} else {
				res.writeHead(200, {
					'content-type': 'text/html;chartset="utf-8"'
				})
				res.write(data)
				res.end()
			}
		})
	})

	server.listen(port)
	console.log(`server runing at http://127.0.0.1:${port}`)
}

porIsOccupied(port, runServer)
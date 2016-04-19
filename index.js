'use strict'

const app = require('./src/app')
const port = app.get('port')
const server = app.listen(port)

server.on('listening', () => console.log(`SlackRadio API started on ${app.get('host')}:${port}`))

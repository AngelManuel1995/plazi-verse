'use strict'
const port = process.env.PORT || 3000
const express = require('express')
const chalk = require('chalk')
const http = require('http')
const api = require('./api')
const app = express()
app.use('/api', api)
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`${chalk.green.bold(`[platziverse-api] is running ${port}`)}`)
})

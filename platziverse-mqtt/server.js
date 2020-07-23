'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const backend = {
  type: 'redis',
  redis,
  return_buffers: true
}
const settings = {
  port: 1883,
  backend
}

const config = {
  database: process.env.DB_NAME || 'platziverse',
  username: process.env.DB_USER || 'platzi',
  password: process.env.DB_PASS || 'platzi',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'postgres',
  logging: s => debug(s)
}

const server = new mosca.Server(settings)

let Agent = null; let Metric = null

server.on('clientConnected', (client) => {
  debug(`Client Connected: ${client.id}`)
}) // Cuando el cliente mqtt se connecta

server.on('clientDisconnected', (client) => {
  debug(`Client Disconnected: ${client.id}`)
}) // Cuando el cliente mqtt se connecta

server.on('published', (packet, client) => {
  debug(`Received: ${packet.topic}`)
  debug(`Payload: ${packet.payload}`)
})

server.on('ready', async () => {
  const services = await db(config).catch(handlerFatalError)
  Agent = services.Agent
  Metric = services.Metric
  console.log(Metric)
  console.log(Agent)
  console.log(`${chalk.green.bold('[platziverse-mqtt]')} server is running`)
})

server.on('error', handlerFatalError)

function handlerFatalError (error) {
  console.error(`${chalk.red.bold('[Fatal error]')} ${error.message}`)
  process.exit(1)
}

process.on('uncaughtException', handlerFatalError)
process.on('unhandledRejection', handlerFatalError)

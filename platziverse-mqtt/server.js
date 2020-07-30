'use strict'

const debug = require('debug')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const db = require('platziverse-db')
const { parsePayload } = require('./utils')
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
const clients = new Map()
let Agent = null; let Metric = null

server.on('clientConnected', (client) => {
  debug(`Client Connected: ${client.id}`)
  clients.set(client.id, null) // Ingresamos un cliente, pero solo en id porque no conocemos el resto de información
}) // Cuando el cliente mqtt se connecta

server.on('clientDisconnected', (client) => {
  debug(`Client Disconnected: ${client.id}`)
}) // Cuando el cliente mqtt se connecta

server.on('published', async (packet, client) => {
  debug(`Received: ${packet.topic}`)
  switch (packet.topic) {
    case 'agent/connected':
    case 'agent/disconnected':
      debug(`Received: ${packet.payload}`)
      break
    case 'agent/messages':
      debug(`Received: ${packet.payload}`)
      const payload = parsePayload(packet.payload)
      if (payload) {
        payload.agent.connected = true
        let agent = {}
        try {
          agent = await Agent.createOrUpdate(payload.agent)
        } catch (error) {
          return handlerError(error)
        }
        debug(`Agent ${agent.uuid} saved`)
        // Notify agent is connected
        if (!clients.get(client.id)) {
          clients.set(client.id, agent)
          server.publish({
            topic: 'agent/connected',
            payload: JSON.stringify({
              agent: {
                uuid: agent.uuid,
                name: agent.name,
                hostname: agent.hostname,
                pid: agent.pid,
                connected: agent.connected
              }
            })
          })
        }
      }
      break
  }
})

server.on('ready', async () => {
  const services = await db(config).catch(handlerFatalError)
  Agent = services.Agent
  Metric = services.Metric
  console.log(`${chalk.green.bold('[platziverse-mqtt]')} server is running`)
})

server.on('error', handlerFatalError)

function handlerFatalError (error) {
  console.error(`${chalk.red.bold('[Fatal error]')} ${error.message}`)
  console.error(error.stack)
  process.exit(1)
}

function handlerError (error) {
  console.error(`${chalk.red.bold('[Fatal error]')} ${error.message}`)
  console.error(error.stack)
}

process.on('uncaughtException', handlerFatalError)
process.on('unhandledRejection', handlerFatalError)

'use strict'

const debug = require('debug')('platziverse:db:setup')
const db = require('./index')

// console.log("Revisar acá", db, "Revisando acá")

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handlerFatalError)

  console.log('Success!')
  process.exit(0)
}

function handlerFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()

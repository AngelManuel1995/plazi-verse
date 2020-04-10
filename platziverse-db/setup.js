'use strict'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./index')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your datebase, are yoy sure?'
    }
  ])

  if(!answer.setup){
    return console.log('Nothing happend :)')
  }

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
  console.error(`${chalk.red.bold('[ fatal error ]')} ${chalk.bold(err.message)}`)
  console.error(err.stack)
  process.exit(1)
}

setup()

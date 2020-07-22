'use strict'

const debug = require('mosca')('platziverse:mqtt')
const mosca = require('mosca')
const redis = require('redis')
const chalk = require('chalk')
const backend = {
  type:'redis',
  redis,
  return_buffers: true
}
const settings = {
  port:1883,
  backend
}


const servidor = new mosca.Server(settings)
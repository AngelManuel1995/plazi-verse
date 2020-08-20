'use strict'
const express = require('express')
const api = express.Router()
const db = require('platziverse-db')

api.get('/agents', (req, res) => {
  res.send({})
})

api.get('/agents/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})

api.get('/metrics/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})

api.get('/metrics/:uuid/:type', (req, res) => {
  const { uuid, type } = req.params
  res.send({ uuid, type })
})

module.exports = api

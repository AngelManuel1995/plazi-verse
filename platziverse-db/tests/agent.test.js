'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent')

const config = {
  loggin: () => {}
}

const MetricStub = {
  belongsTo: sinon.spy()
}

const single = { ...agentFixtures.single }
const id = 1
let AgentStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }
  const setUpDataBase = proxyquire('../index', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub,
  })
  db = await setUpDataBase(config)
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test('Make it pass', (t) => {
  t.truthy(db.Agent, 'Agent Service Should exist')
  t.truthy(db.Metric, 'Metric Service Should exist')
})

test.serial('Should setup database',(t) => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
})

test.serial('Agent#findById', async (t) => {
  const agent = await db.Agent.findById(id)
  t.deepEqual(agent, agentFixtures.byId(id), 'Should be the same')
})
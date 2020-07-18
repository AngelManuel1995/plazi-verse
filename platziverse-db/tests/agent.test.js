'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixture = require('./fixtures/agent')
const single = { ... agentFixture.single }
let db = null
const id = 1
let sandbox = null
const config = {
  logging: function () {}
}
const MetrictStub = {
  belongsTo: sinon.spy()
}
let AgentStub = null
test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixture.byId(id)))
  const setupDatabase = proxyquire('../index', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetrictStub
  })
  db = await setupDatabase(config)
})

test.afterEach(() => {
  sandbox && sinon.restore()
})

test('Agent', (t) => {
  t.truthy(db.Agent, 'Db Agent shoul exist')
})

test.serial('setup', (t) => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany got executed')
  t.true(AgentStub.hasMany.calledWith(MetrictStub), 'AgentModel.hasMany got executed witd MetrictModel as parameter')
  t.true(MetrictStub.belongsTo.called, 'MetricModel.belongsTo got executed')
  t.true(MetrictStub.belongsTo.calledWith(AgentStub), 'MetricModel.belongsTo got executed with AgentModel as parameter')
})

test.serial('Agent#findById', async (t) => {
  const agent = await db.Agent.findById(id)
  t.deepEqual(agent, agentFixture.byId(id), 'Should be the same')
})

test.serial('Agent#createOrUpdate', async (t) => {
  const agent = await db.Agent.createOrUpdate(single)
  t.deepEqual(agent, single, 'Agent should be the same')
})

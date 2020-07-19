'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const agentFixtures = require('./fixtures/agent')
const agent = require('./fixtures/agent')

const config = {
  loggin: () => {}
}

const MetricStub = {
  belongsTo: sinon.spy()
}

const single = { ...agentFixtures.single }
const id = 1
const uuid = 'yyyy-yyyy-yyyy'
const uuidArgs = {
  where: {
    uuid
  }
}
let AgentStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  //Model findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  //Model update Stud
  AgentStub.updateOne = sandbox.stub()
  AgentStub.updateOne.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  //Model findById Stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))

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

test.serial('Agent#createOrUpdate - exist', async (t) => {
  const agent = await db.Agent.createOrUpdate(single)
  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne shold be called twice')
  t.true(AgentStub.updateOne.called, 'updateOne should be called')
  t.deepEqual(agent, single, 'Agent should be the same')
})
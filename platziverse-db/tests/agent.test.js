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
const uuidArgs = { where: { uuid } }
const connectedArgs = { where: { connected: true } }
const usernameArgs = { where: { username: 'platzi', connected: true } }
const newAgent = {
  uuid: '123-123-123',
  name: 'test',
  username: 'test',
  hostname: 'test',
  pid: 0,
  connected: false
}

let AgentStub = null
let db = null
let sandbox = null

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandbox.spy()
  }

  // Model findOne Stub
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  // Model update Stud
  AgentStub.updateOne = sandbox.stub()
  AgentStub.updateOne.withArgs(single, uuidArgs).returns(Promise.resolve(single))

  // Model findById Stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))

  // Model create Stub
  AgentStub.create = sandbox.stub()
  AgentStub.create.withArgs(newAgent).returns(Promise.resolve({
    toJSON () { return newAgent }
  }))

  // Model findAll Stub
  AgentStub.findAll = sandbox.stub()
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all))
  AgentStub.findAll.withArgs(connectedArgs).returns(Promise.resolve(agentFixtures.connected))
  AgentStub.findAll.withArgs(usernameArgs).returns(Promise.resolve(agentFixtures.platzi))

  const setUpDataBase = proxyquire('../index', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
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

test.serial('Should setup database', (t) => {
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

test.serial('Agent#createOrUpdate - new', async (t) => {
  const agent = await db.Agent.createOrUpdate(newAgent)
  t.true(AgentStub.findOne.called, 'findOne should be called')
  t.true(AgentStub.findOne.calledOnce, 'findOne should be called once')
  t.true(AgentStub.findOne.calledWith({where : { uuid: newAgent.uuid }}), 'findOne should be called with uuid args')
  t.true(AgentStub.create.called, 'create shold be called')
  t.true(AgentStub.create.calledOnce, 'create shold be called once')
  t.true(AgentStub.create.calledWith(newAgent), 'create should be called with newAgent args')
  t.deepEqual(agent, newAgent, 'Agent shold be the same')
})

test.serial('Agent#findByUsername', async (t) => {
  const agents = await db.Agent.findByUsername('platzi')
  t.true(AgentStub.findAll.called, 'findAll should be called')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(usernameArgs), 'findAll should be called witdh username args')
  t.is(agents.length, agentFixtures.platzi.length)
  t.deepEqual(agents, agentFixtures.platzi)
})

test.serial('Agent#findConnected', async (t) => {
  const agents = await db.Agent.findConnected()
  t.true(AgentStub.findAll.called, 'findAll should be called')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(connectedArgs), 'findAll should be called without connected args')
  t.is(agents.length, agentFixtures.connected.length)
  t.deepEqual(agents, agentFixtures.connected)
})

test.serial('Agent#findAll', async (t) => {
  const agents = await db.Agent.findAll()
  t.true(AgentStub.findAll.called, 'findAll should be called')
  t.true(AgentStub.findAll.calledOnce, 'findAll should be called once')
  t.true(AgentStub.findAll.calledWith(), 'findAll should be called without args')
  t.is(agents.length, agentFixtures.all.length)
  t.deepEqual(agents, agentFixtures.all)
})
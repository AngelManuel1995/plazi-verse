'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
let db = null
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

test.serial('setup',(t) => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany got executed')
  t.true(AgentStub.hasMany.calledWith(MetrictStub), 'AgentModel.hasMany got executed witd MetrictModel as parameter')
  t.true(MetrictStub.belongsTo.called , 'MetricModel.belongsTo got executed')
  t.true(MetrictStub.belongsTo.calledWith(AgentStub) , 'MetricModel.belongsTo got executed with AgentModel as parameter')
})
'user strict'

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
    const { uuid } = agent
    const cond = {
      where: {
        uuid
      }
    }

    const existingAgent = AgentModel.findOne(cond)
    if (existingAgent) {
      const agentUpdated = await AgentModel.updateOne(agent, cond)
      return agentUpdated ? AgentModel.findOne(cond) : existingAgent
    }
    const agentCreted = await AgentModel.create(agent)
    return agentCreted.toJSON()
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    const connected = true
    return AgentModel.findAll({
      where: {
        username,
        connected
      }
    })
  }

  return {
    findById,
    createOrUpdate,
    findByUuid,
    findAll,
    findConnected,
    findByUsername
  }
}

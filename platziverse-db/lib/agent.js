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
    if(existingAgent){
      const agentUpdated = await AgentModel.updateOne(agent, cond)
      return agentUpdated ? AgentModel.findOne(cond) : existingAgent
    }
    const agentCreted = await AgentModel.create(agent)
    return agentCreted.toJSON()
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  return {
    findById,
    createOrUpdate
  }
}

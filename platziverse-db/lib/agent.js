'user strict'

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
      
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  return {
    findById,
    createOrUpdate
  }
}

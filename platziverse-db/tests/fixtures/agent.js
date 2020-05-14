'use strict'

const agent = {
  id: 1,
  uuid: 'yyyy-yyyy-yyyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: '',
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const extend = (obj, values) => {
  const clone = { ...obj }
  return { ...clone, ...values }
}

const agents = [
  agent,
  extend(agent, { id: 2, uuid: 'yyyy-yyyy-yyyz', connected: false, username: 'test' }),
  extend(agent, { id: 3, uuid: 'yyyy-yyyy-yyzw' }),
  extend(agent, { id: 3, uuid: 'yyyy-yyyy-yzwa', username: 'test' })
]

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  platzi: agents.filter(a => a.username === 'platzi'),
  byUuid: id => agents.filter(a => a.uuid === id).shift(),
  byId: id => agents.filter(a => a.id === id).shift()
}

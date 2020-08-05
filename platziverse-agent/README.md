# platziverse-agent

## Usage

``` js

const PlatziverseAgent = require('platziverse-agent')

const agent = new PlatziverseAgent({
  interval: 2000
})

agent.coonect()

agent.on('agent/message', payload => {
  console.log(payload)
})
setTimeout(() => agent.disconnect(), 20000)

```
# Platziverse-mqtt


## `anget/connected`

``` js
{
	agent: {
		uuid, // autogenerar
		username, // definir por configuración
		name, // definir por configuración
		hostname, // Obtener del sistema operativo
		pid // Obtener del proceso
	}
}
```

## `agent/disconnected`

``` js 
{
	agent: {
		uuid
	}
}
```

## `agent/message`

```js 
{
	agent,
	metrics: [],
	timestamp // Generar cuando creamos el mensaje
}
```
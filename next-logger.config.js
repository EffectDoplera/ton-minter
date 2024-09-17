const pino = require('pino')

const logger = (defaultConfig) =>
  pino({
    ...defaultConfig,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  })

module.exports = {
  logger,
}

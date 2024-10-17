import { createLogger, format, transports } from 'winston';

const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.eu',
    path: '/api/v2/logs?dd-api-key=13f1d123a5160d17e400f9907c4cfaf3&ddsource=nodejs&service=web-server',
    ssl: true
};
  
const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Console(),
    new transports.Http(httpTransportOptions),
  ],
});

export { logger };
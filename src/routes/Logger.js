import { createLogger, format, transports } from 'winston';

const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.eu',
    path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${process.env.DATADOG_SERVICE}`,
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
import pino from 'pino';
import { readFile } from 'fs/promises';
const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));

export default pino({
  name: pkg.name,
  level: process.env.STAGE === 'dev' ? 'debug' : 'warn',
  formatters: {
    level: (label) => ({
      level: label.toUpperCase(),
    }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

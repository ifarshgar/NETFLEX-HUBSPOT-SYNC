import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let logs = [];

export const clearLogs = () => {
  logs.length = 0;
};

export const log = (message: string | object) => {
  if (typeof message === 'object') {
    logs.push(JSON.stringify(message, null, 4));
  } else {
    logs.push(message);
  }
};

export const saveLogs = (logFileName) => {
  if (logs.length === 0) {
    console.log('No logs to save.');
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${logFileName}_${timestamp}.log`;

  const logsDir = path.join(__dirname, '..', 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir);
  }

  const filePath = path.join(logsDir, filename);
  writeFileSync(filePath, logs.join('\n'), 'utf8');

  console.log(`Logs saved to ${filename}`);
  clearLogs();
};

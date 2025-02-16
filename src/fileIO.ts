import { createReadStream, existsSync, mkdir, mkdirSync, promises, writeFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csvParser from 'csv-parser';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FOLDER = '../data';

const getFilePath = async (filename: string) => {
  const filePath = path.join(__dirname, DATA_FOLDER, filename);
  const directory = path.dirname(filePath);

  if (!existsSync(directory)) {
    mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        logger.error('Error creating directory:', err);
      } else {
        logger.info(`${DATA_FOLDER} directory created successfully!`);
      }
    });
  }

  return filePath;
};

export const writeToFile = async (filename: string, data: string): Promise<string> => {
  const filePath = await getFilePath(filename);

  return new Promise((resolve, reject) => {
    writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        logger.error(`Error writing to file ${filename}:`);
        logger.error(err);
        reject(err);
      }

      logger.info(`File ${filename} written successfully.`);
      resolve(`File ${filename} written successfully.`);
    });
  });
};

export const readFromFile = async (filename: string): Promise<string> => {
  const filePath = path.join(__dirname, DATA_FOLDER, filename);

  try {
    const data = await promises.readFile(filePath, { encoding: 'utf8' });
    logger.info(`File ${filename} loaded successfully.`);
    return data;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      logger.warn(`File ${filename} not found. Proceeding with default values.`);
      return '';
    } else {
      logger.error(`Error reading file ${filename}:`, err);
      throw err;
    }
  }
};

export const readCSVFile = (filename: string): Promise<string[]> => {
  const filePath = path.join(__dirname, DATA_FOLDER, filename);

  return new Promise((resolve, reject) => {
    const results = [];
    createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        logger.info(`File ${filename} loaded successfully.`);
        resolve(results);
      })
      .on('error', (err) => {
        logger.error(`Error reading file ${filename}:`);
        logger.error(err);
        reject(err);
      });
  });
};

const getFilePathSync = (filename: string) => {
  const filePath = path.join(__dirname, DATA_FOLDER, filename);
  const directory = path.dirname(filePath);

  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }

  return filePath;
};

export const writeToFileSync = (filename: string, data: string): void => {
  const filePath = getFilePathSync(filename);

  writeFile(filePath, data, 'utf8', (err) => {
    if (err) {
      logger.error(`Error writing to file ${filename}:`);
      logger.error(err);
    }

    logger.info(`File ${filename} written successfully.`);
  });
};

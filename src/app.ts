import chalk from 'chalk';
import { getNetflexAuthTokens, getNetflexCompanies, getNetflexContacts } from './netflexService.js';
import { readCSVFile, readFromFile, writeToFile, writeToFileSync } from './fileIO.js';
import { convertCSVToJSON, convertJSONToCSV } from './csv.js';
import { logger } from './logger.js';
import { getTodayDate } from './utils.js';

// HubSpot batch only accepts 100 records per request so we need to apply a limit and send data in batches
const BATCH_LIMIT = 100;
const LAST_RUN_DATE_FILE = 'last_run_date.txt';
const NETFLEX_CONTACTS_FILE = 'netflex-contacts.csv';

const main = async () => {
  const netflexAuthTokens = await getNetflexAuthTokens();

  // const netflexCompanies = await getNetflexCompanies(netflexAuthTokens);
  // const netflexCompaniesCSV = await convertJSONToCSV(netflexCompanies);
  // await writeToFile('netflex-companies.csv', netflexCompaniesCSV);

  const lastRunDate = await readFromFile(LAST_RUN_DATE_FILE);
  logger.info(`last app run date: ${lastRunDate}`);

  const searchQuery = lastRunDate ? `updated:>${lastRunDate}` : '*';
  const netflexContacts = await getNetflexContacts(netflexAuthTokens, 'updated:>2025-02-15');
  const netflexContactsCSV = await convertJSONToCSV(netflexContacts);
  writeToFileSync(NETFLEX_CONTACTS_FILE, netflexContactsCSV);

  const contactsCSV = await readCSVFile(NETFLEX_CONTACTS_FILE);
  const contacts = await convertCSVToJSON(contactsCSV);
  console.log((contacts));

  const todayDate = getTodayDate();
  await writeToFile(LAST_RUN_DATE_FILE, todayDate);

  process.exit(0);

  // const csv = await convertJSONToCSV([{a: { b: { c: 'c'}}}]);
  // logger.info(csv);
  // await writeToFileSync('csvData.csv', csv);
  // const data = await readCSVFile('csvData.csv');
  // const json = await convertCSVToJSON(data);
  // logger.info(json);
};

main();

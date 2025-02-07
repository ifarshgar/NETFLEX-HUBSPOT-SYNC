import chalk from 'chalk';
import { deleteAllHubspotContacts, getHubspotContacts } from './hubspotService.js';
import { clearLogs, log, saveLogs } from './logger.js';
import { closeInput, getInput } from './utils.js';
import { getFilteredNetflexContacts } from './netflexUtils.js';
import { getAllHubspotContactIds } from './hubspotUtils.js';

// HubSpot batch only accepts 100 records per request so we need to apply a limit and send data in batches
const BATCH_LIMIT = 100;

let hubspotContacts = [];
let netflexContacts = [];

const mainMenu = async () => {
  while (true) {
    console.log('\n📌 Choose an option:');
    console.log('1- Get all HubSpot contacts');
    console.log('2- Get all Netflex contacts');
    console.log('3- Delete all HubSpot contacts');
    console.log('4- Sync all Netflex contacts to HubSpot contacts');
    console.log('5- Sync all Netflex companies to HubSpot companies');
    console.log('0- Exit');

    const choice = (await getInput(chalk.yellow('👉 Enter your choice: '))) as string;

    switch (choice.trim()) {
      case '1':
        console.log(chalk.magenta('Please wait...'));
        clearLogs();
        hubspotContacts = await getHubspotContacts();
        saveLogs('get_hubspot_contacts');
        break;
      case '2':
        console.log(chalk.magenta('Please wait...'));
        clearLogs();
        netflexContacts = await getFilteredNetflexContacts();
        saveLogs('get_netflex_contacts');
        break;
      case '3':
        console.log(chalk.magenta('Please wait...'));
        clearLogs();
        const hubspotContactIds = getAllHubspotContactIds(hubspotContacts);
        for (let contactIds of hubspotContactIds) {
          deleteAllHubspotContacts(contactIds);
        }
        saveLogs('delete_hubspot_contacts');
        break;
      case '4':
        break;
      case '5':
        break;
      case '0':
        console.log(chalk.yellow('👋 Exiting...'));
        closeInput();
        return;
      default:
        console.log(chalk.red('❌ Invalid option! Please choose a valid number.'));
    }
  }
};

// Start the application
mainMenu();

// clearLogs();
// // for (let i = 0; i < netflexContactsList.length; i++) {
//   const contacts = netflexContactsList[2];
//   const hubspotContacts = getHubspotContactsBasedOnNetflex(contacts);
//   postHubspotContacts(hubspotContacts);
// // }
// saveLogs('contacts_log_sync');

// clearLogs();
// const hubspotContacts = await getHubspotContacts();
// saveLogs('get_hubspot_contacts');

// // HubSpot batch only accepts 100 records per request so we need to apply a limit and send data in batches
// const hubspotContactIds = hubspotContacts.map((contact) => contact.id);
// const hubspotContactIdsList = [];
// for (let i = 0; i < hubspotContactIds.length; i += BATCH_LIMIT) {
//   if (i % BATCH_LIMIT === 0) {
//     hubspotContactIdsList.push(hubspotContactIds.slice(i, i + BATCH_LIMIT));
//   }
// }

// for (let i = 0; i < hubspotContactIdsList.length; i++) {
//   const contacts = netflexContactsList[2];
//   const hubspotContacts = getHubspotContactsBasedOnNetflex(contacts);
//   postHubspotContacts(hubspotContacts);
// // }

// deleteAllHubspotContacts(hubspotContactIds);

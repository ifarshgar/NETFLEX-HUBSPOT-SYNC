import chalk from 'chalk';
import {
  deleteAllHubspotContacts,
  getHubspotContacts,
  postHubspotContacts,
} from './hubspotService.js';
import { clearLogs, log, saveLogs } from './logger.js';
import { closeInput, getInput } from './utils.js';
import { getFilteredNetflexContacts } from './netflexUtils.js';
import { getAllHubspotContactIds, getHubspotContactsBasedOnNetflex } from './hubspotUtils.js';
import { HubspotContact, NetflexContact } from './types.js';

// HubSpot batch only accepts 100 records per request so we need to apply a limit and send data in batches
const BATCH_LIMIT = 100;

let hubspotContacts: HubspotContact[][] = [];
let netflexContacts: NetflexContact[][] = [];

const mainMenu = async () => {
  while (true) {
    console.log('\n📌 Choose an option:');
    console.log('1- Get all HubSpot contacts');
    console.log('2- Get all Netflex contacts');
    console.log('3- Delete all HubSpot contacts');
    console.log('4- Get all HubSpot companies');
    console.log('5- Get all Netflex companies');
    console.log('6- Delete all HubSpot companies');
    console.log('7- Sync all Netflex contacts to HubSpot contacts');
    console.log('8- Sync all Netflex companies to HubSpot companies');
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
        console.log(chalk.magenta('Please wait...'));
        break;
      case '5':
        console.log(chalk.magenta('Please wait...'));
        break;
      case '6':
        console.log(chalk.magenta('Please wait...'));
        break;
      case '7':
        console.log(chalk.magenta('Please wait...'));
        clearLogs();
        for (let i = 0; i < netflexContacts.length; i++) {
          const contacts = netflexContacts[i];
          const hubspotContacts = getHubspotContactsBasedOnNetflex(contacts);
          postHubspotContacts(hubspotContacts);
        }
        saveLogs('contacts_log_sync');
        console.log(chalk.green('Netflex contacts successfully synced with HubSpot!'));
        break;
      case '8':
        console.log(chalk.magenta('Please wait...'));
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

import chalk from 'chalk';
import { CONFIG } from './config.js';
import { HubspotContact } from './types.js';

const HubspotGetContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HubspotPostContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';

export const getHubspotContacts = async () => {
  const BEARER_TOKEN = CONFIG.HUBSPOT_BEARER_TOKEN;

  try {
    const response = await fetch(HubspotGetContactsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        'Failed to get Netflex customers.' + '\n' + `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    const contacts: HubspotContact[] = data.results;
    return contacts;
  } catch (error) {
    console.error(error);
  }
};

export const postHubspotContacts = async (contacts: HubspotContact[]) => {
  const BEARER_TOKEN = CONFIG.HUBSPOT_BEARER_TOKEN;
  const bodyData = {
    inputs: [...contacts],
  };
  console.log(bodyData['inputs']);

  try {
    const response = await fetch(HubspotPostContactsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HubSpot API error: ${errorData.message || response.status}`);
    }

    const responseData = await response.json();
    console.log(chalk.green('Netflex customers successfully synced with HubSpot!'));
    console.log(responseData);
  } catch (error) {
    console.error(chalk.red('Failed to post Netflex contacts to HubSpot.'));
    console.error(error);
  }
};

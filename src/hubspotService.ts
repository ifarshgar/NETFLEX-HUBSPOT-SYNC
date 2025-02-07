import chalk from 'chalk';
import { CONFIG } from './config.js';
import { HubspotContact } from './types.js';
import { log } from './logger.js';

const HubspotGetContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HubspotPostContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';
const HubspotDeleteContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/archive';
const BEARER_TOKEN = CONFIG.HUBSPOT_BEARER_TOKEN;

export const getHubspotContacts = async () => {
  const allContacts = [];
  let after = null;

  try {
    do {
      const url = new URL(HubspotGetContactsUrl);
      if (after) {
        url.searchParams.append('after', after);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        log('------------------------------------------');
        log('Failed to get HubSpot contacts.');
        log(`HTTP error! Status: ${response.status.toString()}`);
        log('------------------------------------------');
        return;
      }

      const data = await response.json();
      const contacts: HubspotContact[] = await data.results;
      allContacts.push([...contacts]);

      after = data.paging?.next?.after || null;
    } while (after);

    log(allContacts);
    return allContacts;
  } catch (error) {
    console.error(error);
  }
};

export const deleteAllHubspotContacts = async (contactIds: { id: string }[]) => {
  const bodyData = {
    inputs: [...contactIds],
  };

  log('Deleting the following contacts from HubSpot:');
  log(bodyData);
  log('------------------------------------------');

  try {
    const response = await fetch(HubspotDeleteContactsUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      // const errorData = await response.json();
      // console.log('HubSpot API error');
      // console.log(errorData.message);
      // console.log('response status: ' + response.status.toString());
      // throw new Error(`HubSpot API error: ${errorData.message || response.status}`);

      log('------------------------------------------');
      log('Failed to delete HubSpot contacts.');
      log(`HTTP error! Status: ${response.status.toString()}`);
      log('------------------------------------------');
      return;
    }

    const responseData = response.status === 204 ? {} : await response.json();
    log('All contacts were successfully deleted from HubSpot!');
    log(responseData);
  } catch (error) {
    console.log('Failed to delete HubSpot contacts.');
    console.log(error.toString());
  }
};

export const postHubspotContacts = async (contacts: HubspotContact[]) => {
  const bodyData = {
    inputs: [...contacts],
  };

  log('Posting the following contacts to HubSpot:');
  log(bodyData);
  log('------------------------------------------');

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
       log('------------------------------------------');
       log('Failed to post HubSpot contacts.');
       log(`HTTP error! Status: ${response.status.toString()}`);
       log('------------------------------------------');
       return;
       
      // const errorData = await response.json();
      // console.log('HubSpot API error');
      // console.log(errorData.message);
      // console.log('response status: ' + response.status.toString());
      // throw new Error(`HubSpot API error: ${errorData.message || response.status}`);
    }

    const responseData = await response.json();
    log(responseData);
  } catch (error) {
    console.log('Failed to post Netflex contacts to HubSpot.');
    console.log(error.toString());
  }
};

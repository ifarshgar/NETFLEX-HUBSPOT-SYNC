import chalk from 'chalk';
import { CONFIG } from './config.js';
import { HubspotContact } from './types.js';
import { createLogger } from './logger.js';
import winston from 'winston';

const HubspotGetContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';
const HubspotPostContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';
const HubspotDeleteContactsUrl = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/archive';
const BEARER_TOKEN = CONFIG.HUBSPOT_BEARER_TOKEN;

export const getHubspotContacts = async () => {
  const logger = createLogger('get_hubspot_contacts');
  logger.info('Getting all HubSpot contacts...');
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
        logger.error('------------------------------------------');
        logger.error('Failed to get HubSpot contacts.');
        logger.error(`HTTP error! Status: ${response.status.toString()}`);
        logger.error('------------------------------------------');
        return;
      }

      const data = await response.json();
      const contacts: HubspotContact[] = await data.results;
      allContacts.push([...contacts]);

      after = data.paging?.next?.after || null;
    } while (after);

    logger.info('All contacts were successfully fetched from HubSpot!');
    logger.verbose(allContacts);
    return allContacts;
  } catch (error) {
    logger.error('Failed to get HubSpot contacts.');
    logger.error(error);
  }
};

export const deleteAllHubspotContacts = async (contactIds: { id: string }[], logger: winston.Logger) => {
  const bodyData = {
    inputs: [...contactIds],
  };

  logger.verbose('Deleting the following contacts from HubSpot:');
  logger.verbose(bodyData);
  logger.verbose('------------------------------------------');

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
      logger.error('------------------------------------------');
      logger.error('Failed to delete HubSpot contacts.');
      logger.error(`HTTP error! Status: ${response.status.toString()}`);
      logger.error('------------------------------------------');
      return;
    }

    const responseData = response.status === 204 ? {} : await response.json();
    logger.verbose(responseData);
  } catch (error) {
    logger.error('Failed to delete HubSpot contacts.');
    logger.error(error.toString());
  }
};

export const postHubspotContacts = async (contacts: HubspotContact[], logger: winston.Logger) => {
  const bodyData = {
    inputs: [...contacts],
  };

  logger.verbose('Posting the following contacts to HubSpot:');
  logger.verbose(bodyData);
  logger.verbose('------------------------------------------');

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
      logger.error('------------------------------------------');
      logger.error('Failed to post HubSpot contacts.');
      logger.error(`HTTP error! Status: ${response.status.toString()}`);
      logger.error('------------------------------------------');
      // return;
    }

    const responseData = await response.json();
    logger.verbose(responseData);
  } catch (error) {
    logger.error('Failed to post HubSpot contacts.');
    logger.error(error.toString());
  }
};

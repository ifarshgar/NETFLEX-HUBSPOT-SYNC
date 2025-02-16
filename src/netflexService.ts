import winston from 'winston';
import { CONFIG } from './config.js';
import { NetflexAuthResponse, NetflexAuthTokens, NetflexCompany, NetflexContact } from './types.js';
import { logger } from './logger.js';

const NetflexAuthUrl = 'https://api.bergenchamber.netflexapp.com/v1/auth';
const NetflexCompaniesUrl = 'https://api.bergenchamber.netflexapp.com/v1/builder/structures/10002';
const NetflexContacts = 'https://api.bergenchamber.netflexapp.com/v1/search';

export const getNetflexAuthTokens = async () => {
  logger.info('Getting Netflex Auth tokens...');

  const credentials = btoa(`${CONFIG.NETFLEX_USERNAME}:${CONFIG.NETFLEX_PASSWORD}`);

  try {
    const response = await fetch(NetflexAuthUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.error(
        'Failed to get Netflex auth tokens.' + '\n' + `HTTP error! Status: ${response.status}`
      );
      throw new Error(
        'Failed to get Netflex auth tokens.' + '\n' + `HTTP error! Status: ${response.status}`
      );
    }

    const data: NetflexAuthResponse[] = await response.json();
    const authTokens: NetflexAuthTokens = {
      private_key: data[0].private_key,
      public_key: data[0].public_key,
    };
    logger.info('Netflex Auth tokens were successfully acquired.');
    return authTokens;
  } catch (error) {
    logger.error(error);
  }
};

export const getNetflexCompanies = async (authTokens: NetflexAuthTokens) => {
  logger.info('Getting Netflex companies...');

  const credentials = btoa(`${authTokens.public_key}:${authTokens.private_key}`);

  try {
    const response = await fetch(NetflexCompaniesUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.error(
        'Failed to get Netflex companies.' + '\n' + `HTTP error! Status: ${response.status}`
      );
      throw new Error(
        'Failed to get Netflex companies.' + '\n' + `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    const companies: NetflexCompany[] = data.entries;
    logger.info('Netflex companies were fetched successfully.');
    logger.verbose(companies);
    return companies;
  } catch (error) {
    logger.error(error);
  }
};

export const getNetflexContacts = async (authTokens: NetflexAuthTokens, searchQuery: string) => {
  logger.info('Getting Netflex contacts...');

  const allContacts: NetflexContact[] = [];
  let page = 1;
  let responseStatus;
  let last_page;

  const credentials = btoa(`${authTokens.public_key}:${authTokens.private_key}`);
  const url = new URL(NetflexContacts);
  url.searchParams.set('relation', 'customer');
  url.searchParams.set('order', 'created');
  url.searchParams.set('dir', 'desc');
  url.searchParams.set('size', '100');
  url.searchParams.set('fields', '*');
  url.searchParams.set('q', searchQuery);

  try {
    do {
      url.searchParams.set('page', page.toString());
      logger.info('url: ' + url);
      page++;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      responseStatus = response.status;
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      last_page = data.last_page;
      const contacts: NetflexContact[] = data.data;
      allContacts.push(...contacts);
    } while (responseStatus === 200 && page < last_page);

    logger.info(`${allContacts.length} Netflex contacts were fetched successfully.`);
    logger.verbose(allContacts);
    return allContacts;
  } catch (error) {
    logger.error(error);
  }
};

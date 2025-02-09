import { CONFIG } from './config.js';
import { createLogger } from './logger.js';
import { NetflexAuthResponse, NetflexAuthTokens, NetflexCompany, NetflexContact } from './types.js';

const NetflexAuthUrl = 'https://api.bergenchamber.netflexapp.com/v1/auth';
const NetflexContactsUrl = 'https://api.bergenchamber.netflexapp.com/v1/builder/structures/10001';
const NetflexCompaniesUrl = 'https://api.bergenchamber.netflexapp.com/v1/builder/structures/10002';

export const getNetflexAuthTokens = async () => {
  const logger = createLogger('get_netflex_auth_tokens');
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

export const getNetflexContacts = async (authTokens: NetflexAuthTokens) => {
  const logger = createLogger('get_netflex_contacts');
  logger.info('Getting Netflex contacts...');

  const credentials = btoa(`${authTokens.public_key}:${authTokens.private_key}`);

  try {
    const response = await fetch(NetflexContactsUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.error('------------------------------------------');
      logger.error('Failed to get Netflex contacts.');
      logger.error(`HTTP error! Status: ${response.status.toString()}`);
      logger.error('------------------------------------------');
      return;
    }

    const data = await response.json();
    const contacts: NetflexContact[] = data.entries;
    logger.info('Netflex contacts were fetched successfully.');
    logger.verbose(contacts);
    return contacts;
  } catch (error) {
    logger.error(error);
  }
};

export const getNetflexCompanies = async (authTokens: NetflexAuthTokens) => {
  const logger = createLogger('get_netflex_companies');
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

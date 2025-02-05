import { CONFIG } from './config.js';
import { NetflexAuthResponse, NetflexAuthTokens, NetflexContact } from './types.js';

const NetflexAuthUrl = 'https://api.bergenchamber.netflexapp.com/v1/auth';
const NetflexContactsUrl = 'https://api.bergenchamber.netflexapp.com/v1/builder/structures/10001';

export const getNetflexAuthTokens = async () => {
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
      throw new Error(
        'Failed to get Netflex auth tokens.' + '\n' + `HTTP error! Status: ${response.status}`
      );
    }

    const data: NetflexAuthResponse[] = await response.json();
    const authTokens: NetflexAuthTokens = {
      private_key: data[0].private_key,
      public_key: data[0].public_key,
    };
    return authTokens;
  } catch (error) {
    console.error(error);
  }
};

export const getNetflexContacts = async (authTokens: NetflexAuthTokens) => {
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
      throw new Error(
        'Failed to get Netflex contacts.' + '\n' + `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    const contacts: NetflexContact[] = data.entries;
    return contacts;
  } catch (error) {
    console.error(error);
  }
};

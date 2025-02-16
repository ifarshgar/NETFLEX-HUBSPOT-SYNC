import winston from 'winston';
import { getNetflexAuthTokens, getNetflexContacts } from './netflexService.js';
import { NetflexContact } from './types.js';

export const getFilteredNetflexContacts = async (logger: winston.Logger) => {
  const authTokens = await getNetflexAuthTokens();
  const netflexContacts = await getNetflexContacts(authTokens, 'created:>2025-02-12');

  // filtering out duplicate contacts that have the same email address
  const uniqueNetflexContacts = getUniqueNetflexContacts(netflexContacts);

  return uniqueNetflexContacts;
};

export const getUniqueNetflexContacts = (netflexContacts: NetflexContact[]) => {
  const uniqueContacts = new Map();

  for (const contact of netflexContacts) {
    const email = contact.email || contact.id;
    const existingContact = uniqueContacts.get(email);
    if (!existingContact || new Date(contact.created) > new Date(existingContact.created)) {
      uniqueContacts.set(email, contact);
    }
  }

  return Array.from(uniqueContacts.values());
};

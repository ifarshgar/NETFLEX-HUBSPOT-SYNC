import { createLogger } from './logger.js';
import { getNetflexAuthTokens, getNetflexContacts } from './netflexService.js';
import { NetflexContact } from './types.js';

export const getFilteredNetflexContacts = async (
  createdAfter = '2020-01-01T00:00:00',
  BATCH_LIMIT = 100
) => {
  const netflexAuthTokens = await getNetflexAuthTokens();
  const netflexContacts = await getNetflexContacts(netflexAuthTokens);

  // filtering customers that were created after a certain date
  const cutoffDate = new Date(createdAfter);
  const filteredNetflexContacts = netflexContacts.filter((customer) => {
    const createdDate = new Date(customer.created);
    return createdDate >= cutoffDate;
  });

  // filtering out duplicate customers that have the same email address 
  const filteredAndUniqueNetflexContacts = getUniqueNetflexContacts(filteredNetflexContacts);

  const netflexContactsList = [];
  for (let i = 0; i < filteredAndUniqueNetflexContacts.length; i += BATCH_LIMIT) {
    if (i % BATCH_LIMIT === 0) {
      netflexContactsList.push(filteredAndUniqueNetflexContacts.slice(i, i + BATCH_LIMIT));
    }
  }

  return netflexContactsList;
};

export const getUniqueNetflexContacts = (netflexContacts: NetflexContact[]) => {
  const uniqueContacts = new Map();

  for(const contact of netflexContacts) {
    if(!uniqueContacts.has(contact.email)) {
      uniqueContacts.set(contact.id, contact);
    }
  }
  return Array.from(uniqueContacts.values());
};


import { getNetflexAuthTokens, getNetflexContacts } from './netflexService.js';

export const getFilteredNetflexContacts = async (
  createdAfter = '2025-01-28T00:00:00',
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

  const netflexContactsList = [];
  for (let i = 0; i < filteredNetflexContacts.length; i += BATCH_LIMIT) {
    if (i % BATCH_LIMIT === 0) {
      netflexContactsList.push(filteredNetflexContacts.slice(i, i + BATCH_LIMIT));
    }
  }

  return netflexContactsList;
};

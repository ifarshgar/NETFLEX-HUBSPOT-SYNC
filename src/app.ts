import chalk from 'chalk';
import { getNetflexAuthTokens, getNetflexContacts } from './netflexService.js';
import { get } from 'http';
import { getHubspotContacts, postHubspotContacts } from './hubspotService.js';
import { HubspotContact } from './types.js';

const netflexAuthTokens = await getNetflexAuthTokens();
const netflexContacts = await getNetflexContacts(netflexAuthTokens);

// filtering customers that were created after a certain date (28th Jan 2025)
const cutoffDate = new Date('2025-01-28T00:00:00');
const filteredNetflexContacts = netflexContacts.filter((customer) => {
  const createdDate = new Date(customer.created);
  return createdDate >= cutoffDate;
});

const hubspotContacts = filteredNetflexContacts.map((contact) => {
  const email = contact.email !== '' ? contact.email : contact.name.split(' ')[0] + contact.name.split(' ')[1] + '@netflex.com';
  const hubspotContact: HubspotContact = {
    id: email,
    idProperty: 'email',
    properties: {
      email: email,
      firstname: contact.name.split(' ')[0],
      lastname: contact.name.split(' ')[1],
    },
    archived: false,
  };
  return hubspotContact;
});

postHubspotContacts(hubspotContacts);

import { HubspotContact, NetflexContact } from './types.js';

export const getNameForHubspot = (name: string) => {
  const hubspotName = {
    firstname: '',
    lastname: '',
  };

  try {
    if (name && name.split(' ').length > 1) {
      const spaceIndex = name.indexOf(' ');
      hubspotName.firstname = name.substring(0, spaceIndex);
      hubspotName.lastname = name.substring(spaceIndex + 1);
    }
  } catch (error) {
    console.error('Error in getNameForHubspot: ', name, error);
  }

  return hubspotName;
};

export const getHubspotContactsBasedOnNetflex = (contacts: NetflexContact[]): HubspotContact[] =>
  contacts.map((contact) => {
    const name = getNameForHubspot(contact.name);

    const hubspotContact: HubspotContact = {
      id: contact.id,
      idProperty: 'netflex_contact_id',
      properties: {
        netflex_contact_id: contact.id,
        email: contact.email,
        firstname: name.firstname,
        lastname: name.lastname,
        phone: contact.phone,
        website: contact.url,
      },
      archived: false,
    };
    return hubspotContact;
  });

export const getAllHubspotContactIds = (contactsList: HubspotContact[][]) => {
  const contactIdsList: { id: string }[][] = [];
  for (let contacts of contactsList) {
    const list = contacts.map((contact) => ({ id: contact.id }));
    contactIdsList.push([...list]);
  }
  return contactIdsList;
};

export type NetflexAuthResponse = {
  alias: string;
  name: string;
  private_key: string;
  public_key: string;
  created: string;
};

export type NetflexAuthTokens = {
  private_key: string;
  public_key: string;
};

export interface Image {
  file: string;
  path: string;
  name: string | null;
  description: string | null;
}

export interface NetflexContact {
  id: string;
  directoryId: string;
  name: string;
  title: string | null;
  url: string;
  revision: string;
  created: string;
  updated: string;
  published: string;
  author: string | null;
  userId: string;
  useTime: string;
  start: string | null;
  stop: string | null;
  tags: string | null;
  public: string;
  authGroups: string | null;
  image: Image;
  phone: string | null;
  email: string | null;
  position: string;
  biography: string | null;
  hash: string;
  variants: any[];
}

export type HubspotContact = {
  id: string;
  idProperty: string;
  properties: {
    createdate?: string;
    email: string;
    firstname: string;
    hs_object_id?: string;
    lastmodifieddate?: string;
    lastname: string;
  };
  createdAt?: string;
  updatedAt?: string;
  archived: boolean;
};

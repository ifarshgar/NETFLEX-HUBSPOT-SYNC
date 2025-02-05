import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  HUBSPOT_BEARER_TOKEN: process.env.HUBSPOT_BEARER_TOKEN,
  NETFLEX_USERNAME: process.env.NETFLEX_USERNAME,
  NETFLEX_PASSWORD: process.env.NETFLEX_PASSWORD,
};

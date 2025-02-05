# Netflex-HubSpot Sync App

## Overview

The Netflex-HubSpot Sync App is a Node.js application written in TypeScript that facilitates seamless synchronization between Netflex and HubSpot. This app automates data transfer, ensuring up-to-date records across both platforms.

## Features

Real-time Synchronization: Automatically syncs data between Netflex and HubSpot.

Error Handling: Robust error handling for failed sync attempts.

Logging: Detailed logging for tracking sync activities.

Custom Configuration: Environment-based settings for flexibility.

Secure Authentication: OAuth2 and API Key-based authentication support.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## API keys and OAuth credentials for Netflex and HubSpot configuration
- Create a .env file in the root directory and add the required credentials:
```
HUBSPOT_BEARER_TOKEN=your_hubspot_private_app_token
NETFLEX_USERNAME=your_netflex_username
NETFLEX_PASSWORD=your_netflex_password
```

## Quick Start

- yarn 
- yarn start



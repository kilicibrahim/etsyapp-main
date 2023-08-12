# Etsy Integration Application
This application interfaces with the Etsy API to enable creating and managing listings.

This project is in early development stage.

## Prerequisites

Before you can run this application, you need to have the following setup:

- Node.js and npm installed. You can download these from [here](https://nodejs.org/en/download/).

- An Etsy developer account and a registered Etsy app to get your API Key (clientID). You can register for a developer account [here](https://www.etsy.com/developers/register).

- A configured `config` folder, a `data.json` file and a `token.json` file in your root directory. You can obtain these by following the instructions below.

## Setup

### Config Folder

Create a `config` folder in the root directory of the project. In the folder, create a `index.js` file with the following content:

```javascript
// config/index.js
module.exports = {
  "clientID": "<Your Etsy API Key>",
  "clientSecret": "<Your Etsy API Secret>",
  "shopId": "<Your Etsy Shop ID>",
  "redirectUri": "<Your application's Redirect URI>",
  "shippingProfileId": "<Your Etsy Shipping Profile ID>"
}
```
Replace the placeholder texts with your actual Etsy credentials.

Create a `data.json` file in the root directory of the project with the following structure:

```json
{
  "clientID": "<Your Etsy API Key>",
  "redirectUri": "<Your application's Redirect URI>",
  "codeVerifier": "<Your Code Verifier>",
  "fullUrl": "<Your Full Etsy OAuth URL>"
}
```
Replace the placeholder texts with your actual Etsy credentials.

The `token.json` file is generated automatically when you authenticate with Etsy. It contains your access_token and refresh_token.

### Running the Application
To run the application, navigate to the project directory in your terminal and type:

```batch
npm install
```
```batch
npm start
```

The application will start and can be accessed at http://localhost:3003.

If you have any issues running the application, please contact the repository owner or open an issue.

Please replace `<Your Etsy API Key>`, `<Your Etsy API Secret>`, `<Your Etsy Shop ID>`, `<Your application's Redirect URI>`, `<Your Etsy Shipping Profile ID>`, `<Your Code Verifier>`, and `<Your Full Etsy OAuth URL>` with your actual values.

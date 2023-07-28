const fs = require('fs');

const crypto = require("crypto");
const id = 'Your client ID';
const redirectUri = 'http://localhost:3003/oauth/redirect';

// The next two functions help us generate the code challenge
// required by Etsy’s OAuth implementation.
const base64URLEncode = (str) =>
  str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest();

// We’ll use the verifier to generate the challenge.
// The verifier needs to be saved for a future step in the OAuth flow.
const codeVerifier = base64URLEncode(crypto.randomBytes(32));

// With these functions, we can generate
// the values needed for our OAuth authorization grant.
const codeChallenge = base64URLEncode(sha256(codeVerifier));
const state = Math.random().toString(36).substring(7);
const full_Url = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${redirectUri}&scope=email_r&client_id=${id}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
const scope = "email_r listings_r listings_w"; // The permissions we’re requesting from Etsy
const authUrl = 'https://www.etsy.com/oauth/connect?'
    + 'response_type=code'
    + '&client_id=' + id
    + '&redirect_uri=' + redirectUri
    + '&scope=' + scope
    + '&state=' + codeVerifier
    + '&code_challenge=' + codeChallenge
    + '&code_challenge_method=S256';
    
console.log(`State: ${state}`);
console.log(`Code challenge: ${codeChallenge}`);
console.log(`Code verifier: ${codeVerifier}`);
console.log(`Full URL: ${authUrl}`);

const data = {
  clientID: id,
  redirectUri: redirectUri,
  codeVerifier: codeVerifier,
  fullUrl: authUrl
};
fs.writeFile('data.json', JSON.stringify(data), (err) => {
  if (err) throw err;
  console.log('Data saved!');
});
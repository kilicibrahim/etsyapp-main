// middleware/tokenValidation.js

const fs = require('fs');
const { getRequestOptions, performRequest } = require('../utils/apiRequests');
const { clientID } = require('../config');

const refreshAccessToken = async (refreshToken) => {
    const requestOptions = getRequestOptions('POST', {
        'Content-Type': 'application/json'
    }, {
        grant_type: 'refresh_token',
        client_id: clientID,
        refresh_token: refreshToken
    });

    const tokenData = await performRequest('https://api.etsy.com/v3/public/oauth/token',
     requestOptions);

    return tokenData;
}

const tokenValidation = async (req, res, next) => {
    try {
        const tokenInfo = require('../token.json');
        let { access_token, expires_in } = tokenInfo;

        // TO DO:İbrahim
        //we should be checking for expires_in but I don't know exactly what time it is equal to. So this is a TO DO:İbrahim
        // Check token expiration
        // const expirationDate = new Date(expires_in * 1000); // Token expiry time is in seconds
        // if (new Date() >= expirationDate) {
            // Token has expired, need to refresh
            const newTokenInfo = await refreshAccessToken(tokenInfo.refresh_token);

            if (newTokenInfo) {
                access_token = newTokenInfo.access_token;
                expires_in = newTokenInfo.expires_in;

                // Save the new token data
                fs.writeFileSync('./token.json', JSON.stringify(newTokenInfo), (err) => {
                    if (err) throw err;
                    console.log('Token data has been written to file');
                });
            }
        // }

        // Save the token in the request for use in other route handlers
        req.accessToken = access_token;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Failed to validate or refresh token', error);
        res.status(500).send('Failed to validate or refresh token');
    }
};

module.exports = tokenValidation;

// utils/apiRequests.js
const tokenInfo = require('../token.json');

const https = require('https');

const getRequestOptions = (method, headers, data = null) => { //delete this if its not used
    return {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) })
    };
};
const getRequestOptionsForPost = (method, headers, data = null) => {
    return {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) })
    };
};
const getRequestOptionsForGet = (method, headers, queryParams = null) => {
    return {
        method,
        headers,
        urlParams: queryParams
    };
};

const performRequest = async (url, requestOptions) => {
    // if there are params, add them to the url
    if (requestOptions.urlParams) {
        url += '?' + new URLSearchParams(requestOptions.urlParams).toString();
    }
    console.log("Requesting url from :"+url);
    return new Promise((resolve, reject) => {
        const req = https.request(url, requestOptions, (res) => {
            res.setEncoding('utf8');
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseData));
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (requestOptions.body) {
            req.write(requestOptions.body);
        }

        req.end();
    });
};


function getSelectedQueryParamsForListing(queryParams) {
    const validParams = ['state', 'page', 'limit', 'sort_on', 'sort_order', 'includes'];
    let selectedParams = {};

    for (let key in queryParams) {
        if (validParams.includes(key)) {
            selectedParams[key] = queryParams[key];
        }
    }

    return selectedParams;
  }

module.exports = {
    getRequestOptions,
    performRequest,
    getSelectedQueryParamsForListing,
    getRequestOptionsForPost,
    getRequestOptionsForGet
};

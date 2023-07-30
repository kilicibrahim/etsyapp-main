const config = require('../config');
const { performRequest, getRequestOptionsForGet, getSelectedQueryParamsForListing, getRequestOptionsForPost } = require('./apiRequests');
//TO DO: Add a function that gets the SKU as well as the listing ID
const getDraftListingIds = async (req) => {
    // Make sure to only ask for draft listings
    req.query.state = 'draft';

    const selectedParams = getSelectedQueryParamsForListing(req.query);
    const requestOptions = getRequestOptionsForGet('GET', {
        'Content-Type': 'application/json',
        'x-api-key': config.clientID,
        'Authorization': `Bearer ${req.accessToken}`
    }, selectedParams);

    const data = await performRequest(
        `https://openapi.etsy.com/v3/application/shops/${config.shopId}/listings`,
         requestOptions);

    if (data) {
        // Filter and map the response to only include ids of draft listings
        const draftListingIds = data.results.filter(result => result.state === 'draft').map(result => result.listing_id);
        // Return the list of ids
        return draftListingIds;
    } else {
        throw new Error('Failed to get shop listings');
    }
};

const postDraftListing = async (access_token, listingDetails, res) => {

    const requestOptions = getRequestOptionsForPost('POST', {
        'Content-Type': 'application/json',
        'x-api-key': config.clientID,
        'Authorization': `Bearer ${access_token}`
    }, listingDetails);
    
    try {
        const data = await performRequest(
            `${config.baseURL}v3/application/shops/${config.shopId}/listings`,
             requestOptions, res);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating draft listing');
    }
};


module.exports = {
    getDraftListingIds,
    postDraftListing 
};

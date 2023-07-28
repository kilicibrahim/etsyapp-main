const express = require('express');
const router = express.Router();
const { performRequest, getRequestOptionsForGet, getSelectedQueryParamsForListing } = require('../utils/apiRequests');
const config = require('../config');

router.get('/', async (req, res) => {

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
        res.render('listings', { listings: data.results });
    } else {
        res.send('Failed to get shop listings');
    }
});

module.exports = router;

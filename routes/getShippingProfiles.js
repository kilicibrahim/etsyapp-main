// routes/getShippingProfiles.js

const express = require('express');
const router = express.Router();
const { performRequest, getRequestOptionsForGet } = require('../utils/apiRequests');
const config = require('../config');

router.get('/', async (req, res) => {
    const requestOptions = getRequestOptionsForGet('GET', {
        'Content-Type': 'application/json',
        'x-api-key': config.clientID,
        'Authorization': `Bearer ${req.accessToken}`
    });

    try {
        const data = await performRequest(
            `${config.baseURL}/v3/application/shops/${config.shopId}/shipping-profiles`,
             requestOptions);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving shipping profiles');
    }
});

module.exports = router;

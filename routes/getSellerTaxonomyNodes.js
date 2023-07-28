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

    const data = await performRequest(
        'https://api.etsy.com/v3/application/seller-taxonomy/nodes',
         requestOptions);

    if (data) {
        res.send(data);
    } else {
        res.send('Failed to fetch seller taxonomy nodes');
    }
});

module.exports = router;

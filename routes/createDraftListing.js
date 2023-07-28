// routes/createDraftListing.js

const express = require('express');
const router = express.Router();
const { performRequest, getRequestOptionsForPost } = require('../utils/apiRequests');
const config = require('../config');

router.post('/', async (req, res) => {

    //most of this part will be from google drive later on
    const listingDetails = {
        quantity: req.body.quantity,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        who_made: 'i_did',
        when_made: 'made_to_order',
        is_supply: 'false',
        state: 'draft',
        taxonomy_id: 69, //just random
        shipping_profile_id: config.shippingProfileId
        // Add other required details for your listings
    };
    const requestOptions = getRequestOptionsForPost('POST', {
        'Content-Type': 'application/json',
        'x-api-key': config.clientID,
        'Authorization': `Bearer ${req.accessToken}`
    }, listingDetails);
    
    try {
        const data = await performRequest(
            `${config.baseURL}v3/application/shops/${config.shopId}/listings`,
             requestOptions, res);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating draft listing');
    }
});

module.exports = router;

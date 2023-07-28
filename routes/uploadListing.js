// use: const uploadListing = require('./routes/uploadListing');
const express = require('express');
const router = express.Router();
const uploadImage = require('../utils/uploadImage');
const { createDraftListing, getDraftListingIds } = require('../utils/esyApi');
const config = require('../config');

// This route handles the form submission
router.post('/uploadListing', async (req, res) => {
    // Mock data - replace these with real data from Google Drive when ready
    const listingData = { // This will be fetched from Google Sheets
        quantity: "1",
        title: "Example Product Title",
        description: "This is an example product description. It provides basic details about the product.",
        price: "20.00",
        who_made: 'i_did',
        when_made: 'made_to_order',
        is_supply: 'false',
        state: 'draft',
        taxonomy_id: 69, //random taxonomy id
        shipping_profile_id: config.shippingProfileId
    }; 
    const imagePath = "./images/rasitcan.jpg"; // This will be fetched from Google Drive when ready

    try {
        // 1. Post the draft listings
        const draftListings = await createDraftListing(listingData); //we need a function version

        // 2. Get the IDs of the newly created draft listings
        const draftListingIds = await getDraftListingIds();

        // 3. Upload an image to each draft listing
        for (const id of draftListingIds) {
            await uploadImage(config.shopId, id, imagePath, req.accessToken);
        }

        res.send('Upload successful!');
    } catch (err) {
        console.error(err);
        res.send('Error uploading listing.');
    }
});

module.exports = router;

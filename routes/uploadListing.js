// use: const uploadListing = require('./routes/uploadListing');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const uploadImage = require('../utils/uploadImage');
const { postDraftListing, getDraftListingIds } = require('../utils/esyApi');
const config = require('../config');

// This route handles the form submissions from the upload listing page
router.post('/', async (req, res) => {
    // Mock data - replace these with real data from Google Drive when ready
    const listingData = { // This will be fetched from Google Sheets
        quantity: "1",
        title: "Last Test",
        description: "This is an example product description. It provides basic details about the product.",
        price: "20.00",
        who_made: 'i_did',
        when_made: 'made_to_order',
        is_supply: 'false',
        state: 'draft',
        taxonomy_id: 11165, //random taxonomy id
        shipping_profile_id: config.shippingProfileId
    }; 
    // we could get the specific folder id from the google drive later on this is just test
    // Read the specified directory in images and get all file paths
    const folderId = req.body.folderId;
    const directoryPath = `./images/${folderId}`;
    const imageFilenames = fs.readdirSync(directoryPath);
    const imagePaths = imageFilenames.map(filename => path.join(directoryPath, filename));

    try {
        // Post the draft listings
        const draftListings = await postDraftListing(req.accessToken, listingData, res);

        // Get the IDs of the newly created draft listings
        const draftListingIds = await getDraftListingIds(req);

        if (draftListingIds.length > 0) {

        // Upload all images to each draft listing
        // for (const id of draftListingIds) {
        //     for (const imagePath of imagePaths) {
        //         await uploadImage(config.shopId, id, imagePath, req.accessToken);
        //     }
        // }

        // Upload all images to the first draft listing
            for (const imagePath of imagePaths) {
                await uploadImage(config.shopId, draftListingIds[0], imagePath, req.accessToken);
            }
        } else {
            // Handle the case where there are no draft listings
            console.error('No draft listings found.');
            res.send('Error: No draft listings found.');
        }

        res.send('Upload successful!');
    } catch (err) {
        console.error(err);
        res.send('Error uploading listing.');
    }
});

module.exports = router;

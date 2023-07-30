//how to use: const uploadImage = require('../utils/uploadImage');
const config = require('../config');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const uploadImage = async (shopId, listingId, imagePath, accessToken) => {
    const url = `https://openapi.etsy.com/v3/application/shops/${shopId}/listings/${listingId}/images`;

    let form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.clientID,
            'Authorization': `Bearer ${accessToken}`,
            ...form.getHeaders(),
        },
        data: form
    };

    try {
        const response = await axios(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

module.exports = uploadImage;

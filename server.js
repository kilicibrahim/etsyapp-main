const express = require('express');
const exphbs = require('express-handlebars');
const fetch = require("node-fetch");
const fs = require('fs');
const tokenValidation = require('./middleware/tokenValidation');
const routes = require('./routes');

const app = express();

// Create the handlebars instance with default configuration
const hbs = exphbs.create();

// Register the helper
hbs.handlebars.registerHelper('divide', function(a, b) {
    return a / b;
});

// Use the instance to setup express-handlebars
app.use(express.urlencoded({ extended: true }));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Setup the views directory
app.set('views', `${process.cwd()}/views`);

//get required data from code-generator.js
const data = require('./data.json');
const config = require('./config');

const clientID = data.clientID;
const redirectUri = data.redirectUri;
const clientVerifier = data.codeVerifier.trim();
const fullUrl = data.fullUrl;

// This renders our `index.hbs` file.
app.get('/', (req, res) => {
    res.render("index", { full_Url: fullUrl });
});

app.get("/oauth/redirect", async (req, res) => {
    // The req.query object has the query params that Etsy authentication sends
    // to this route. The authorization code is in the `code` param
    const authCode = req.query.code;
    const tokenUrl = 'https://api.etsy.com/v3/public/oauth/token';
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: clientID,
            redirect_uri: redirectUri,
            code: authCode,
            code_verifier: clientVerifier,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Make a request to the token URL
    const response = await fetch(tokenUrl, requestOptions);

    // Extract the access token from the response access_token data field
    if (response.ok) {
        const tokenData = await response.json();
        accessToken = tokenData.access_token;
        refreshToken = tokenData.refresh_token;
        fs.writeFileSync('./token.json', JSON.stringify(tokenData), (err) => {
            if (err) throw err;
            console.log('Token data has been written to file');
        });
        res.redirect(`/welcome?access_token=${tokenData.access_token}`);
    } else {
        // Log http status to the console
        console.log(response.status, response.statusText);

        // For non-500 errors, the endpoints return a JSON object as an error response
        const errorData = await response.json();
        console.log(errorData);
        res.send("oops");
    }
});

app.get("/welcome", async (req, res) => {
    // We passed the access token in via the querystring
    const { access_token } = req.query;
    console.log(access_token);
    // An Etsy access token includes your shop/user ID
    // as a token prefix, so we can extract that too
    const user_id = access_token.split('.')[0];

    const requestOptions = {
        headers: {
            'x-api-key': clientID,
            // Scoped endpoints require a bearer token
            Authorization: `Bearer ${access_token}`,
        }
    };
    

    const response = await fetch(
        `https://api.etsy.com/v3/application/users/${user_id}`,
        requestOptions
    );

    if (response.ok) {
        const userData = await response.json();
        // Load the template with the first name as a template variable.
        res.render("welcome", {
            first_name: userData.first_name
        });
    } else {
        // Log http status to the console
        console.log(response.status, response.statusText);

        // For non-500 errors, the endpoints return a JSON object as an error response
        const errorData = await response.json();
        console.log(errorData);
        res.send("oops");
    }
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/createDraftListingForm', (req, res) => {
    res.render("createDraftListingForm");
});

app.get('/uploadListingForm', (req, res) => {
    res.render('uploadListingForm');
});

app.get('/ListingsForm', (req, res) => {
    res.render("ListingsForm");
});
// Middlewares
app.use(express.json()); // for parsing application/json
app.use(tokenValidation);

// Routes
app.use('/createDraftListing', routes.createDraftListing);
app.use('/getListingById', routes.getListingById);
app.use('/getShippingProfiles', routes.getShippingProfiles);
app.use('/listings', routes.listings);
app.use('/getSellerTaxonomyNodes', routes.getSellerTaxonomyNodes);
app.use('/uploadListing', routes.uploadListing);


const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`Server listening on port ${port}`));

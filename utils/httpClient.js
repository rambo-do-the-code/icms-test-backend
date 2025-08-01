const axios = require('axios');
require('dotenv').config();

const httpClient = axios.create({
    baseURL: process.env.LMS_API,
    headers: {
        'X-API-KEY': process.env.LMS_API_KEY,
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

module.exports = httpClient;
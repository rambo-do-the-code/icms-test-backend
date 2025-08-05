const axios = require('axios');
require('dotenv').config();

const tokenCache = {};

const getToken = async (key = 'default') => {
    if (tokenCache[key]) return tokenCache[key];

    try {
        const username = process.env.AUTH_USERNAME;
        const password = process.env.AUTH_PASSWORD;

        if (!username || !password) {
            throw new Error('❌ Missing AUTH_USERNAME or AUTH_PASSWORD in .env');
        }

        const encoded = Buffer.from(`${username}:${password}`).toString('base64');

        const res = await axios.post(
            process.env.AUTH_API,
            {},
            {
                headers: {
                    Authorization: `Basic ${encoded}`
                }
            }
        );

        const accessToken = res.data?.accessToken;
        if (!accessToken) throw new Error('❌ No accessToken found in login response');

        const bearer = `Bearer ${accessToken}`;
        tokenCache[key] = bearer;

        return bearer;
    } catch (err) {
        console.error('🚨 Failed to fetch token:', err.message);
        throw err;
    }
};

const getExternalToken = async () => {
    const cacheKey = 'externalSession';
    if (tokenCache[cacheKey]) return tokenCache[cacheKey];

    try {
        const payload = {
            paramsData: {
                resourceId: parseInt(process.env.LMS_RESOURCE_ID, 10),
                user: process.env.LMS_USER_ID,
                sessionId: process.env.LMS_SESSION_ID,
                mode: process.env.LMS_MODE,
                schoolId: process.env.LMS_SCHOOL_ID
            },
            type: 'SCHOOL',
            sessionExpireTimeMinute: parseInt(process.env.LMS_SESSION_EXPIRE_MIN, 10)
        };

        const res = await axios.post(process.env.LMS_API, payload, {
            headers: {
                'X-API-KEY': process.env.LMS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const sessionToken = res.data?.data?.sessionToken;

        if (!sessionToken) {
            throw new Error('❌ No sessionToken found in LMS API response');
        }

        const bearer = `Bearer ${sessionToken}`;
        tokenCache[cacheKey] = bearer;
        return bearer;
    } catch (err) {
        console.error('🚨 Failed to fetch external session token:', err.message);
        throw err;
    }
};

module.exports = {
    getToken,
    getExternalToken
};

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const { getExternalToken ,getToken } = require('../utils/tokenManager');
const {
    dataTest
} = require('../data/caseData');

const successThreshold = parseFloat(process.env.SUCCESS_THRESHOLD || '0.95');
const concurrentUsers = parseInt(process.env.CONCURRENT_USERS || '10', 10);
const heavyConcurrentUsers = parseInt(process.env.HEAVY_CONCURRENT_USERS || '20', 10);

const runId = Math.floor(Date.now() / 1000);
const logDir = path.join(__dirname, '../logs', `${runId}`);
fs.mkdirSync(logDir, { recursive: true });

const allResults = [];

const runConcurrentTest = async (label, makeRequest, users) => {
    const start = Date.now();
    const results = await Promise.all(Array.from({ length: users }, () => makeRequest()));
    const duration = Date.now() - start;
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    const summary = {
        label,
        total: results.length,
        success: successCount,
        failed: failCount,
        durationMs: duration,
        timestamp: new Date().toISOString()
    };

    console.log(`\n🚀 ${label}`);
    console.log(`🔄 Total: ${results.length}`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`⏱️ Time: ${duration}ms`);

    allResults.push(summary);

    const expectedMinSuccess = Math.floor(users * successThreshold);
    if (successCount < expectedMinSuccess) {
        throw new Error(`${label} failed threshold: expected at least ${expectedMinSuccess} but got ${successCount}`);
    }
};

afterAll(() => {
    const resultPath = path.join(logDir, 'summary.json');
    fs.writeFileSync(resultPath, JSON.stringify(allResults, null, 2), 'utf-8');
    console.log(`\n📦 Result log saved: ${resultPath}`);
});

test('Case 1 - LMS lấy link học', async () => {
    await runConcurrentTest('Case 1 - LMS link học', () =>
            axios.post(process.env.LMS_API, dataTest[0], {
                headers: {
                    'X-API-KEY': process.env.LMS_API_KEY,
                    'Content-Type': 'application/json'
                }
            }).then(() => ({ success: true }))
                .catch(() => ({ success: false }))
        , concurrentUsers);
});

test('Case 2 - Tạo course từ AI', async () => {
    const token = await getToken();

    await runConcurrentTest('Case 2 - Generate Course', () =>
            axios.post(process.env.AI_COURSE_API, dataTest[1], {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }).then(() => ({ success: true }))
                .catch(() => ({ success: false }))
        , heavyConcurrentUsers);
});

test('Case 4 - Lưu điểm học sinh', async () => {
    const token = await getExternalToken();
    await runConcurrentTest('Case 4 - Save Score', () =>
            axios.post(process.env.LRS_SAVE_SCORE_API,  dataTest[2], {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }).then(() => ({ success: true }))
                .catch(() => ({ success: false }))
        , concurrentUsers);
});

test('Case 5 - Danh sách content', async () => {
    const token = await getToken();
    await runConcurrentTest('Case 5 - Content List', () =>
            axios.get(process.env.CONTENT_API, {
                headers: {
                    'Authorization': token
                }
            }).then(() => ({ success: true }))
                .catch(() => ({ success: false }))
        , concurrentUsers);
});

test('Case 6 - Danh sách ngân hàng câu hỏi', async () => {
    const token = await getToken();
    await runConcurrentTest('Case 6 - Question Bank', () =>
            axios.get(process.env.QUESTION_API, {
                headers: {
                    'Authorization': token
                }
            }).then(() => ({ success: true }))
                .catch(() => ({ success: false }))
        , concurrentUsers);
});

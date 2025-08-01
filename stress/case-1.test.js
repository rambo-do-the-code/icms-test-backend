const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const successThreshold = parseFloat(process.env.SUCCESS_THRESHOLD || '0.95'); // 👈 thêm dòng này

const concurrentUsers = parseInt(process.env.CONCURRENT_USERS || '10', 10);
const runId = Math.floor(Date.now() / 1000); // folder theo seconds
const logDir = path.join(__dirname, 'logs/case1', `${runId}`);
fs.mkdirSync(logDir, { recursive: true });

const allResults = [];

const runConcurrentTest = async (label, makeRequest) => {
    const start = Date.now();
    const results = await Promise.all(
        Array.from({ length: concurrentUsers }, () => makeRequest())
    );
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

    const expectedMinSuccess = Math.floor(concurrentUsers * successThreshold);
    expect(successCount).toBeGreaterThanOrEqual(expectedMinSuccess);


};

afterAll(() => {
    const resultPath = path.join(logDir, 'summary.json');
    fs.writeFileSync(resultPath, JSON.stringify(allResults, null, 2), 'utf-8');
    console.log(`\n📦 Result log saved: ${resultPath}`);
});

var dataTest = [
    // dev
    {
        paramsData: {
            resourceId: 337,
            user: "12345987",
            sessionId: "12345987",
            mode: "test",
            schoolId: "b981f01c-e87d-4c10-bf68-f9941b9b31ab"
        },
        type: "SCHOOL",
        sessionExpireTimeMinute: 1000
    },
    // prod
    {
        paramsData: {
            resourceId: 4537,
            user: "12345987",
            sessionId: "12345987",
            mode: "test",
            schoolId: "c8c50bb4-a039-4d01-ab4d-8f33e19f61fe"
        },
        type: "SCHOOL",
        sessionExpireTimeMinute: 1000
    }
];


test('Case 1 - LMS lấy link học', async () => {
    await runConcurrentTest('Case 1 - LMS link học', () =>
        axios.post(process.env.LMS_API, dataTest[0], {
            headers: {
                'X-API-KEY': process.env.LMS_API_KEY,
                'Content-Type': 'application/json',
            }
        }).then(() => ({ success: true }))
            .catch(() => ({ success: false }))
    );
});
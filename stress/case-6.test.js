const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const successThreshold = parseFloat(process.env.SUCCESS_THRESHOLD || '0.95'); // 👈 thêm dòng này

const concurrentUsers = parseInt(process.env.CONCURRENT_USERS || '10', 10);
const runId = Math.floor(Date.now() / 1000); // folder theo seconds
const logDir = path.join(__dirname, 'logs/case6', `${runId}`);
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

test('Case 6 - Danh sách ngân hàng câu hỏi', async () => {
    await runConcurrentTest('Case 6 - Question Bank', () =>
        axios.get(process.env.QUESTION_API, {
            headers: {
                'Authorization': process.env.QUESTION_TOKEN
            }
        }).then(res => ({ success: true, data: res.data }))
            .catch(err => ({ success: false, data: err.response?.data || err.message }))
    );
});
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const successThreshold = parseFloat(process.env.SUCCESS_THRESHOLD || '0.95');

const concurrentUsers = parseInt(process.env.HEAVY_CONCURRENT_USERS || '10', 10);
const runId = Math.floor(Date.now() / 1000); // folder theo seconds
const logDir = path.join(__dirname, 'logs/case2', `${runId}`);
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

const aiCourseDataSet = [
    // dev
    {
        resourceName: "FROM STRESS TEST 2",
        theme: "apollo",
        pages: [
            {
                pageName: "Basic True/False",
                questionRawIds: [11488, 11489, 11490, 11491, 11492, 11493, 11494, 11495]
            },
            {
                pageName: "Basic Multiple Choice",
                questionRawIds: [11464, 11465, 11466, 11467, 11468, 11469, 11470, 11471]
            },
            {
                pageName: "Basic Drag-and-Drop Matching",
                questionRawIds: [11496]
            }
        ]
    },
    // prod
    {
        resourceName: "FROM STRESS TEST LAI LAN NUA 1",
        theme: "apollo",
        pages: [
            {
                pageName: "Basic True/False",
                questionRawIds: [2161, 2160, 2159, 2158, 2157, 2156, 2155, 2154]
            },
            {
                pageName: "Basic Multiple Choice",
                questionRawIds: [2137, 2136, 2135, 2134, 2133, 2132, 2131, 2130]
            },
            {
                pageName: "Basic Drag-and-Drop Matching",
                questionRawIds: [2162]
            }
        ]
    }
];


test('Case 2 - Tạo course từ AI', async () => {
    await runConcurrentTest('Case 2 - Generate Course', () =>
        axios.post(process.env.AI_COURSE_API, aiCourseDataSet[1] , {
            headers: {
                'Authorization': process.env.AI_COURSE_TOKEN,
                'Content-Type': 'application/json'
            }
        }).then(res => ({ success: true, data: res.data }))
            .catch(err => ({ success: false, data: err.response?.data || err.message }))
    );
});
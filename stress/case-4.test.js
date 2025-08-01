const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const successThreshold = parseFloat(process.env.SUCCESS_THRESHOLD || '0.95'); // 👈 thêm dòng này

const concurrentUsers = parseInt(process.env.CONCURRENT_USERS || '10', 10);
const runId = Math.floor(Date.now() / 1000); // folder theo seconds
const logDir = path.join(__dirname, 'logs/case4', `${runId}`);
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

test('Case 4 - Lưu điểm học sinh', async () => {
    await runConcurrentTest('Case 4 - Save Score', () =>
        axios.post(process.env.LRS_SAVE_SCORE_API, {
            actor: null,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/answered",
                display: { "en-US": "answered" }
            },
            object: {
                objectType: "Activity",
                id: "some-id",
                definition: {
                    name: { en: "component" },
                    type: "http://adlnet.gov/expapi/activities/question"
                }
            },
            result: {
                score: {
                    raw: { score: 5, maxScore: 8, scaled: 0.625 }
                },
                success: false,
                completion: true
            },
            pageId: "page-id",
            context: {
                contextActivities: {
                    grouping: [
                        {
                            objectType: "Activity",
                            id: "some-course",
                            definition: {
                                type: "http://adlnet.gov/expapi/activities/course",
                                name: { en: "quadaukho4" }
                            }
                        }
                    ]
                }
            },
            id: "32ff80fc-06cf-4d92-9e31-7967c5722c50"
        }, {
            headers: {
                'Authorization': process.env.LRS_TOKEN,
                'Content-Type': 'application/json'
            }
        }).then(res => ({ success: true, data: res.data }))
            .catch(err => ({ success: false, data: err.response?.data || err.message }))
    );
});
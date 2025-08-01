#!/bin/bash

echo "🚀 Running test - Attempt 1"
npx jest stress/case-1.test.js

echo "🚀 Running test - Attempt 2"
npx jest stress/case-2.test.js

echo "⏭️ Skipping run 3"

echo "🚀 Running test - Attempt 4"
npx jest stress/case-4.test.js

echo "🚀 Running test - Attempt 5"
npx jest stress/case-5.test.js

echo "🚀 Running test - Attempt 5"
npx jest stress/case-6.test.js

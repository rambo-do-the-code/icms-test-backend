## 🧪 Run Stress Test Script

Run the stress test with:

```
npx jest stress/all.test.js
```

### 🌍 Environment Setup

By default, the environment is set to `dev`.  
To run in `prod`, you can either:

**Option 1 – Set it inline:**

```
ENVIRONMENT=prod npx jest stress/all.test.js
```

**Option 2 – Use `.env` file:**

```
# .env
ENVIRONMENT=prod
```

> Make sure your `.env` file also includes required configs like:
>
> ```
> LMS_API=https://your-api.com
> LMS_API_KEY=your-secret-key
> SUCCESS_THRESHOLD=0.95
> CONCURRENT_USERS=10
> HEAVY_CONCURRENT_USERS=20
> ```

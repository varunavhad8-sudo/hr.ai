const http = require('http');

const runTest = async () => {
  console.log('=== HR.AI END-TO-END CONNECTION TEST SUITE ===\n');

  // Test 1: Health Check
  await new Promise((resolve) => {
    console.log('[Test 1] Health Check...');
    const req = http.get('http://localhost:3001/health', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
  });

  // Test 2: Auth Sync
  let mockUserId = null;
  await new Promise((resolve) => {
    console.log('[Test 2] Auth Sync (POST /api/auth/sync)...');
    const postData = JSON.stringify({ email: 'dev@hr.ai', name: 'Developer' });
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/auth/sync',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        try {
          const parsed = JSON.parse(body);
          if (parsed.user) mockUserId = parsed.user._id;
        } catch(e) {}
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail (Mongoose offline in sandboxed workspace)\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
    req.write(postData);
    req.end();
  });

  // Test 3: Get Candidates
  await new Promise((resolve) => {
    console.log('[Test 3] Get Candidates (GET /api/candidates)...');
    const req = http.get('http://localhost:3001/api/candidates', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail (Mongoose offline in sandboxed workspace)\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
  });

  // Test 4: Upload Resume (Multipart Form-Data)
  let parsedCandidateId = '60d5ec123456789012345678'; // fallback ID for remaining tests
  await new Promise((resolve) => {
    console.log('[Test 4] Upload Resume (POST /api/parse-resume)...');
    
    // Simulate a simple multipart/form-data boundary and PDF body
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const filename = 'sample_resume.pdf';
    const fileContent = '%PDF-1.4 ... simulated pdf content ...';
    
    let postData = '';
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="resume"; filename="${filename}"\r\n`;
    postData += 'Content-Type: application/pdf\r\n\r\n';
    postData += fileContent + '\r\n';
    postData += `--${boundary}--\r\n`;

    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/parse-resume',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        try {
          const parsed = JSON.parse(body);
          if (parsed.id || parsed._id) {
            parsedCandidateId = parsed.id || parsed._id;
          }
        } catch(e) {}
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail (Claude/Mongoose offline in sandboxed workspace)\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
    req.write(postData);
    req.end();
  });

  // Test 5: Get Single Candidate
  await new Promise((resolve) => {
    console.log(`[Test 5] Get Single Candidate (GET /api/candidates/${parsedCandidateId})...`);
    const req = http.get(`http://localhost:3001/api/candidates/${parsedCandidateId}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail (Mongoose offline in sandboxed workspace)\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
  });

  // Test 6: Update Candidate
  await new Promise((resolve) => {
    console.log(`[Test 6] Update Candidate (PUT /api/candidates/${parsedCandidateId})...`);
    const postData = JSON.stringify({ notes: 'Test note', stage: 'Shortlisted' });
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: `/api/candidates/${parsedCandidateId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail (Mongoose offline in sandboxed workspace)\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
    req.write(postData);
    req.end();
  });

  // Test 7: Delete Candidate
  await new Promise((resolve) => {
    console.log(`[Test 7] Delete Candidate (DELETE /api/candidates/${parsedCandidateId})...`);
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: `/api/candidates/${parsedCandidateId}`,
      method: 'DELETE'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Response: ${body}`);
        console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail (Mongoose offline in sandboxed workspace)\n');
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`❌ Fail: ${err.message}\n`);
      resolve();
    });
    req.end();
  });

  console.log('=== END-TO-END CONNECTION TEST SUITE COMPLETED ===');
};

runTest();

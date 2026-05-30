const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const apiKey = 'AIzaSyBwh2jtwbEpn9LoLScrwBEniSN_HetXmsM';

const getRealIdToken = async () => {
  console.log('Generating real Firebase Custom Token...');
  const admin = require('./config/firebase');
  const customToken = await admin.auth().createCustomToken('live-test-user-id');
  console.log('Exchanging Custom Token for real Firebase ID Token...');
  
  const postData = JSON.stringify({
    token: customToken,
    returnSecureToken: true
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.idToken) {
            console.log('Successfully retrieved real Firebase ID Token!');
            resolve(parsed.idToken);
          } else {
            reject(new Error('Failed to get ID token: ' + body));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

const runLiveTest = async () => {
  try {
    const idToken = await getRealIdToken();
    const authHeader = `Bearer ${idToken}`;
    console.log('\n=== HR.AI REAL LIVE CONNECTION TEST SUITE ===\n');

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
    await new Promise((resolve) => {
      console.log('[Test 2] Auth Sync (POST /api/auth/sync)...');
      const postData = JSON.stringify({ email: 'live-test@hr.ai', name: 'Live Tester' });
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/sync',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
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
      req.write(postData);
      req.end();
    });

    // Test 3: Get Candidates
    await new Promise((resolve) => {
      console.log('[Test 3] Get Candidates (GET /api/candidates)...');
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/api/candidates',
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      }, (res) => {
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
      req.end();
    });

    // Test 4: Upload Resume (Real Multipart Form-Data with real system PDF file)
    let parsedCandidateId = null;
    await new Promise((resolve) => {
      console.log('[Test 4] Upload Resume (POST /api/parse-resume)...');
      
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const pdfPath = 'C:/Users/VARUN AVHAD/OneDrive/Documents/Zoom/My_Invoice_20260422193832_7972254663 (1).pdf';
      const fileContent = fs.readFileSync(pdfPath);
      const filename = path.basename(pdfPath);
      
      let postData = Buffer.concat([
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="resume"; filename="${filename}"\r\n`),
        Buffer.from('Content-Type: application/pdf\r\n\r\n'),
        fileContent,
        Buffer.from(`\r\n--${boundary}--\r\n`)
      ]);

      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/api/parse-resume',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Authorization': authHeader,
          'Content-Length': postData.length
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log(`- Status Code: ${res.statusCode}`);
          console.log(`- Response: ${body}`);
          try {
            const parsed = JSON.parse(body);
            parsedCandidateId = parsed._id || parsed.id;
          } catch(e) {}
          console.log(res.statusCode === 200 ? '✅ Pass\n' : '❌ Fail\n');
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

    if (!parsedCandidateId) {
      console.log('Skipping remaining tests because candidate creation failed.\n');
      return;
    }

    // Test 5: Get Single Candidate
    await new Promise((resolve) => {
      console.log(`[Test 5] Get Single Candidate (GET /api/candidates/${parsedCandidateId})...`);
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: `/api/candidates/${parsedCandidateId}`,
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      }, (res) => {
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
      req.end();
    });

    // Test 6: Update Candidate
    await new Promise((resolve) => {
      console.log(`[Test 6] Update Candidate (PUT /api/candidates/${parsedCandidateId})...`);
      const postData = JSON.stringify({ notes: 'Live test', stage: 'Shortlisted' });
      const req = http.request({
        hostname: 'localhost',
        port: 3001,
        path: `/api/candidates/${parsedCandidateId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
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
        method: 'DELETE',
        headers: {
          'Authorization': authHeader
        }
      }, (res) => {
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
      req.end();
    });

    console.log('=== HR.AI REAL LIVE CONNECTION TEST SUITE COMPLETED ===');
  } catch (err) {
    console.error('Test execution failed:', err.message);
  }
};

runLiveTest();

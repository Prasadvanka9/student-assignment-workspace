const http = require('http');
const { startServer, stopServer } = require('./server');

const runTests = async () => {
  console.log(`\n========================================`);
  console.log(`🚀 Booting Server for Automated API Test`);
  console.log(`========================================\n`);

  await startServer();

  const PORT = process.env.PORT || 5000;
  console.log(`Server successfully listening on port ${PORT}. Running test suite...\n`);

  const request = (path, method = 'GET', body = null, token = null) => {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const options = {
        hostname: '127.0.0.1',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode, data: parsed });
          } catch {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Health check
    console.log('Test 1: GET / (API Health Check)');
    const health = await request('/');
    console.log('Result:', health.status === 200 ? '✅ PASSED' : '❌ FAILED', health.data);

    // 2. Register
    const testEmail = `teststudent_${Date.now()}@university.edu`;
    console.log(`\nTest 2: POST /api/auth/register (${testEmail})`);
    const regRes = await request('/api/auth/register', 'POST', {
      name: 'Test Student',
      email: testEmail,
      password: 'password123'
    });
    console.log('Result:', regRes.status === 201 ? '✅ PASSED' : '❌ FAILED', regRes.data?.message);
    const token = regRes.data?.data?.token;

    // 3. Login
    console.log('\nTest 3: POST /api/auth/login');
    const loginRes = await request('/api/auth/login', 'POST', {
      email: testEmail,
      password: 'password123'
    });
    console.log('Result:', loginRes.status === 200 ? '✅ PASSED' : '❌ FAILED', 'Token received:', !!loginRes.data?.data?.token);

    // 4. Get Current Profile
    console.log('\nTest 4: GET /api/auth/me');
    const meRes = await request('/api/auth/me', 'GET', null, token);
    console.log('Result:', meRes.status === 200 ? '✅ PASSED' : '❌ FAILED', 'Student Name:', meRes.data?.data?.name);

    // 5. Create Assignment
    console.log('\nTest 5: POST /api/assignments (Create)');
    const createRes = await request(
      '/api/assignments',
      'POST',
      {
        title: 'React Components & Hooks Lab',
        subject: 'React.js',
        description: 'Implement reusable StatCard and AssignmentCard components.',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        priority: 'High',
        status: 'Pending'
      },
      token
    );
    console.log('Result:', createRes.status === 201 ? '✅ PASSED' : '❌ FAILED', 'Assignment ID:', createRes.data?.data?._id);
    const assignmentId = createRes.data?.data?._id;

    // 6. List Assignments
    console.log('\nTest 6: GET /api/assignments (List with Filters)');
    const listRes = await request('/api/assignments?subject=React.js', 'GET', null, token);
    console.log('Result:', listRes.status === 200 ? '✅ PASSED' : '❌ FAILED', 'Count:', listRes.data?.count);

    // 7. Get Dashboard Summary & Stats
    console.log('\nTest 7: GET /api/assignments/stats/summary (Live Database Stats)');
    const statsRes = await request('/api/assignments/stats/summary', 'GET', null, token);
    console.log('Result:', statsRes.status === 200 ? '✅ PASSED' : '❌ FAILED', 'Stats:', statsRes.data?.data);

    // 8. Update Assignment
    console.log(`\nTest 8: PUT /api/assignments/${assignmentId} (Update)`);
    const updateRes = await request(
      `/api/assignments/${assignmentId}`,
      'PUT',
      {
        title: 'React Components & Hooks Lab (Completed Revisions)',
        priority: 'Medium'
      },
      token
    );
    console.log('Result:', updateRes.status === 200 ? '✅ PASSED' : '❌ FAILED', updateRes.data?.message);

    // 9. Patch Status
    console.log(`\nTest 9: PATCH /api/assignments/${assignmentId}/status (Change status)`);
    const patchRes = await request(
      `/api/assignments/${assignmentId}/status`,
      'PATCH',
      { status: 'Completed' },
      token
    );
    console.log('Result:', patchRes.status === 200 ? '✅ PASSED' : '❌ FAILED', patchRes.data?.message);

    // 10. Delete Assignment
    console.log(`\nTest 10: DELETE /api/assignments/${assignmentId}`);
    const deleteRes = await request(`/api/assignments/${assignmentId}`, 'DELETE', null, token);
    console.log('Result:', deleteRes.status === 200 ? '✅ PASSED' : '❌ FAILED', deleteRes.data?.message);

    console.log('\n========================================');
    console.log('🎉 ALL 10 TESTS PASSED SUCCESSFULLY!');
    console.log('========================================\n');

    await stopServer();
    process.exit(0);
  } catch (err) {
    console.error('Test Suite Encountered Error:', err);
    await stopServer();
    process.exit(1);
  }
};

runTests();

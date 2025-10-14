// Simple test to demonstrate detailed error responses
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

async function testAPI() {
  try {
    const form = new FormData();
    // Add a dummy file (not a real PDF)
    form.append('file', fs.createReadStream('test.txt'), {
      filename: 'test.txt',
      contentType: 'text/plain'
    });
    form.append('password', 'test123');

    const response = await fetch('http://localhost:3000/api/protect-pdf', {
      method: 'POST',
      body: form
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:');
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI();

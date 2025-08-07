// Proxy server to forward chatbot messages to n8n webhook and bypass CORS

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // or native fetch in Node 18+
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://tech-soul-boy.app.n8n.cloud/webhook-test/239ac5b1-9e1a-452d-a73b-90f0aec51ccb';

app.post('/api/send-to-n8n', async (req, res) => {
  try {
    const { message, timestamp, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, timestamp, sessionId }),
    });

    if (!n8nResponse.ok) {
      return res.status(500).json({ error: 'Failed to get response from n8n' });
    }

    const data = await n8nResponse.json();

    res.json({ response: data.response || 'No response from AI agent.' });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});

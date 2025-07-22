const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Start WhatsApp bot (index.js)
const botProcess = spawn('node', ['index.js'], {
  stdio: 'inherit',
});

// ✅ Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Homepage route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ✅ Health check route (MUST for Koyeb)
app.get('/health', (req, res) => res.status(200).send('OK'));

// ✅ Start web server
app.listen(PORT, () => {
  console.log(`✅ Web server running on http://localhost:${PORT}`);
});

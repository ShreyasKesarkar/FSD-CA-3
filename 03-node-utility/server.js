const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const file = path.join(__dirname, 'queue.json');
const events = new EventEmitter();
if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
const read = () => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = records => fs.createWriteStream(file).end(JSON.stringify(records, null, 2));
events.on('queueUpdated', record => console.log(`Queue updated: ${record.name}`));
function response(res, status, data) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); }
const server = http.createServer((req, res) => {
  if (req.url !== '/patients') return response(res, 404, { error: 'Route not found' });
  if (req.method === 'GET') return response(res, 200, read());
  if (req.method !== 'POST') return response(res, 405, { error: 'Use GET or POST' });
  let body = ''; req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const patient = JSON.parse(body);
      if (!patient.name || !patient.doctor) return response(res, 400, { error: 'name and doctor are required' });
      patient.id = Date.now(); patient.status = 'Waiting';
      const records = read(); records.push(patient); write(records); events.emit('queueUpdated', patient);
      response(res, 201, patient);
    } catch { response(res, 400, { error: 'Invalid JSON' }); }
  });
});
server.listen(3001, () => console.log('Node queue server: http://localhost:3001'));

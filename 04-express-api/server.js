require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express(); const PORT = process.env.PORT || 4000;
const secret = process.env.JWT_SECRET || 'development-secret';
let patients = []; let nextId = 1;
app.use(express.json());
app.use((req, _res, next) => { console.log(`${new Date().toISOString()} ${req.method} ${req.url}`); next(); });
function validatePatient(req, res, next) { if (!req.body.name || !req.body.doctor) return res.status(400).json({ error: 'name and doctor are required' }); next(); }
function authenticate(req, res, next) { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ error: 'Token required' }); try { req.user = jwt.verify(token, secret); next(); } catch { return res.status(401).json({ error: 'Invalid token' }); } }
app.get('/api/patients', (_req, res) => res.json(patients));
app.post('/api/patients', validatePatient, (req, res) => { const patient = { id: nextId++, ...req.body, status: 'Waiting' }; patients.push(patient); res.status(201).json(patient); });
app.put('/api/patients/:id', validatePatient, (req, res, next) => { const index = patients.findIndex(p => p.id === Number(req.params.id)); if (index < 0) return next(Object.assign(new Error('Patient not found'), { status: 404 })); patients[index] = { ...patients[index], ...req.body }; res.json(patients[index]); });
app.delete('/api/patients/:id', (req, res, next) => { const index = patients.findIndex(p => p.id === Number(req.params.id)); if (index < 0) return next(Object.assign(new Error('Patient not found'), { status: 404 })); res.status(204).end(); patients.splice(index, 1); });
app.post('/api/login', async (req, res) => { if (req.body.username !== 'admin' || !(await bcrypt.compare(req.body.password || '', await bcrypt.hash('admin123', 10)))) return res.status(401).json({ error: 'Invalid credentials' }); res.json({ token: jwt.sign({ username: 'admin' }, secret, { expiresIn: '1h' }) }); });
app.get('/api/protected/queue', authenticate, (_req, res) => res.json({ patients }));
app.use((err, _req, res, _next) => { console.error(err); res.status(err.status || 500).json({ error: err.message || 'Internal server error' }); });
app.listen(PORT, () => console.log(`Express API: http://localhost:${PORT}`));

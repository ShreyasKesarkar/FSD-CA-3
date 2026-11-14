import React, { useEffect, useState } from 'react'; import { createRoot } from 'react-dom/client'; import './style.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
function App() { const [patients, setPatients] = useState([]); const [form, setForm] = useState({ name: '', doctor: '' }); const load = () => fetch(`${API}/patients`).then(r => r.json()).then(setPatients);
  useEffect(load, []);
  const add = e => { e.preventDefault(); fetch(`${API}/patients`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }).then(r => { if (!r.ok) throw new Error('Could not add patient'); return r.json(); }).then(p => { setPatients([p, ...patients]); setForm({ name: '', doctor: '' }); }).catch(alert); };
  return <main><h1>Clinic Queue</h1><form onSubmit={add}><input required placeholder="Patient" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/><input required placeholder="Doctor" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })}/><button>Add patient</button></form><ul>{patients.map(p => <li key={p.id}>{p.name} — Dr. {p.doctor} <span>{p.status}</span></li>)}</ul></main>; }
createRoot(document.getElementById('root')).render(<App />);

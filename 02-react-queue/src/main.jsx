import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './style.css';

const initialPatients = [{ id: 1, name: 'Asha Patel', doctor: 'Mehta', status: 'Waiting' }];

function PatientForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', doctor: '' });
  const submit = e => { e.preventDefault(); if (!form.name.trim() || !form.doctor.trim()) return; onAdd({ ...form, id: Date.now(), status: 'Waiting' }); setForm({ name: '', doctor: '' }); };
  return <form onSubmit={submit}><input required placeholder="Patient" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input required placeholder="Doctor" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} /><button>Add</button></form>;
}
function PatientList({ patients, onStatus }) {
  return <ul>{patients.map(p => <li key={p.id}><strong>{p.name}</strong> — Dr. {p.doctor} <span>{p.status}</span>{p.status !== 'Completed' && <button onClick={() => onStatus(p.id)}>Next</button>}</li>)}</ul>;
}
function Queue({ patients, setPatients }) {
  useEffect(() => { const saved = localStorage.getItem('patients'); if (saved) setPatients(JSON.parse(saved)); }, [setPatients]);
  useEffect(() => localStorage.setItem('patients', JSON.stringify(patients)), [patients]);
  const add = p => setPatients(current => [...current, p]);
  const next = id => setPatients(current => current.map(p => p.id === id ? { ...p, status: p.status === 'Waiting' ? 'Serving' : 'Completed' } : p));
  return <><h2>Today&apos;s queue</h2><PatientForm onAdd={add} />{patients.length ? <PatientList patients={patients} onStatus={next} /> : <p>No patients in queue.</p>}</>;
}
function App() {
  const [patients, setPatients] = useState(initialPatients);
  return <main><nav><Link to="/">Queue</Link> <Link to="/about">About</Link></nav><Routes><Route path="/" element={<Queue patients={patients} setPatients={setPatients} />} /><Route path="/about" element={<p>This reusable React interface manages a clinic waiting queue.</p>} /></Routes></main>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);

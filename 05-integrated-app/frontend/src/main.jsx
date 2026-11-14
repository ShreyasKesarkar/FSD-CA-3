import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const STORAGE_KEY = 'clinic-queue-patients';
const samplePatients = [
  { id: 1, name: 'Asha Patel', doctor: 'Mehta', status: 'Waiting' },
  { id: 2, name: 'Rahul Sharma', doctor: 'Kapoor', status: 'Serving' }
];

function App() {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : samplePatients;
  });
  const [form, setForm] = useState({ name: '', doctor: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = event => {
    event.preventDefault();
    const name = form.name.trim();
    const doctor = form.doctor.trim();
    if (!name || !doctor) return;
    setPatients(current => [
      { id: Date.now(), name, doctor, status: 'Waiting' },
      ...current
    ]);
    setForm({ name: '', doctor: '' });
  };

  const advancePatient = id => {
    setPatients(current => current.map(patient => {
      if (patient.id !== id) return patient;
      const status = patient.status === 'Waiting' ? 'Serving' : 'Completed';
      return { ...patient, status };
    }));
  };

  const removePatient = id => {
    setPatients(current => current.filter(patient => patient.id !== id));
  };

  const visiblePatients = patients.filter(patient =>
    `${patient.name} ${patient.doctor}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <header>
        <h1>Clinic Queue</h1>
        <p>Frontend-only queue management</p>
      </header>
      <form onSubmit={addPatient}>
        <input required placeholder="Patient name" value={form.name}
          onChange={event => setForm({ ...form, name: event.target.value })} />
        <input required placeholder="Doctor name" value={form.doctor}
          onChange={event => setForm({ ...form, doctor: event.target.value })} />
        <button type="submit">Add patient</button>
      </form>
      <input className="search" placeholder="Search queue..." value={search}
        onChange={event => setSearch(event.target.value)} />
      {visiblePatients.length === 0 ? <p className="empty">No patients found.</p> : (
        <ul>{visiblePatients.map(patient => (
          <li key={patient.id}>
            <span><strong>{patient.name}</strong> — Dr. {patient.doctor}
              <em className={patient.status.toLowerCase()}>{patient.status}</em>
            </span>
            <span className="actions">
              {patient.status !== 'Completed' && <button onClick={() => advancePatient(patient.id)}>Next</button>}
              <button className="delete" onClick={() => removePatient(patient.id)}>Delete</button>
            </span>
          </li>
        ))}</ul>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

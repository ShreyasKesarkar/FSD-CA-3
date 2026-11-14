const queue = [];
const queueElement = document.querySelector('#queue');
const message = document.querySelector('#message');

function renderQueue() {
  const search = document.querySelector('#search').value.toLowerCase();
  const status = document.querySelector('#status-filter').value;
  queueElement.innerHTML = '';
  queue.filter(p => (status === 'all' || p.status === status) &&
    `${p.name} ${p.doctor}`.toLowerCase().includes(search)).forEach(patient => {
    const item = document.createElement('li');
    if (patient.priority === 'Urgent') item.classList.add('urgent');
    item.innerHTML = `<span><strong>${patient.name}</strong> — Dr. ${patient.doctor}
      <span class="badge">${patient.status}</span></span>`;
    const actions = document.createElement('span');
    const next = document.createElement('button');
    next.textContent = patient.status === 'Waiting' ? 'Serve' : 'Complete';
    next.disabled = patient.status === 'Completed';
    next.onclick = () => updatePatient(patient.id, patient.status === 'Waiting' ? 'Serving' : 'Completed');
    const remove = document.createElement('button');
    remove.textContent = 'Delete'; remove.className = 'delete';
    remove.onclick = () => deletePatient(patient.id);
    actions.append(next, remove); item.append(actions); queueElement.append(item);
  });
}

async function loadSampleData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
  if (!response.ok) throw new Error('Sample data request failed');
  const users = await response.json();
  queue.push(...users.map((u, i) => ({ id: u.id, name: u.name, doctor: `Doctor ${i + 1}`, priority: 'Normal', status: 'Waiting' })));
  renderQueue();
}

async function sendJson(method, patient) {
  // Demonstrates JSON request/response handling. Replace URL with a real API in production.
  return fetch('https://httpbin.org/anything', {
    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patient)
  });
}

async function updatePatient(id, status) {
  const patient = queue.find(p => p.id === id);
  if (!patient) return;
  patient.status = status; await sendJson('PUT', patient); renderQueue();
}
async function deletePatient(id) {
  await sendJson('DELETE', { id });
  const index = queue.findIndex(p => p.id === id); if (index >= 0) queue.splice(index, 1); renderQueue();
}

document.querySelector('#patient-form').onsubmit = async event => {
  event.preventDefault();
  const name = document.querySelector('#patient-name').value.trim();
  const doctor = document.querySelector('#doctor-name').value.trim();
  if (name.length < 2 || !doctor) { message.textContent = 'Enter a valid patient and doctor name.'; return; }
  const patient = { id: Date.now(), name, doctor, priority: document.querySelector('#priority').value, status: 'Waiting' };
  await sendJson('POST', patient); queue.push(patient); event.target.reset(); message.textContent = 'Patient added.'; renderQueue();
};
document.querySelector('#load-sample').onclick = () => loadSampleData().catch(error => { message.textContent = error.message; });
document.querySelector('#search').oninput = renderQueue;
document.querySelector('#status-filter').onchange = renderQueue;

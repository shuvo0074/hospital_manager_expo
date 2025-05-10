const API = 'http://localhost:4000';
export async function fetchPatients(q, page) {
  const res = await fetch(`${API}/patients?q=${q}&page=${page}&limit=10`);
  return res.json();
}
export async function createAppointment(body) {
  const res = await fetch(`${API}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

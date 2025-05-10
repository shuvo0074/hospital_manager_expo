import { Patient } from '../models/Patient';
import { v4 as uuid } from 'uuid';

const patients: Patient[] = Array.from({ length: 50 }).map((_, i) => ({
  id: uuid(),
  name: `Patient ${i + 1}`,
  dob: `19${70 + (i % 30)}-01-01`
}));

export function searchPatients(q: string, page: number, limit: number) {
  const filtered = patients.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  const total = filtered.length;
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return { total, data };
}

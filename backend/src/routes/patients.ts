import { Router } from 'express';
import { searchPatients } from '../services/patientService';
import { paginationSchema } from '../utils/validate';

const router = Router();

router.get('/', (req, res) => {
  const { error, value } = paginationSchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.message });

  const { q, page, limit } = value;
  const { total, data } = searchPatients(q, page, limit);
  const nextPage = page * limit < total
    ? `/patients?q=${q}&page=${page + 1}&limit=${limit}`
    : null;

  res.json({ total, page, limit, nextPage, data });
});

export default router;

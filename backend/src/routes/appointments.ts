import { Router } from 'express';
import Joi from 'joi';

interface Appointment { patientId: string; doctorId: string; start: Date; end: Date; }
const appointments: Appointment[] = [];

const schema = Joi.object({
  patientId: Joi.string().required(),
  doctorId: Joi.string().required(),
  start: Joi.date().required(),
  end: Joi.date().greater(Joi.ref('start')).required()
});

const router = Router();

router.post('/', (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { patientId, doctorId, start, end } = value as Appointment;
  const conflict = appointments.find(a =>
    a.doctorId === doctorId &&
    ((start < a.end && start >= a.start) || (end > a.start && end <= a.end))
  );
  if (conflict) {
    return res.status(409).json({ error: 'Doctor has a conflicting appointment.' });
  }

  appointments.push({ patientId, doctorId, start, end });
  res.status(201).json({ message: 'Appointment scheduled.' });
});

export default router;

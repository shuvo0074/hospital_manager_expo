import express from 'express';
import patientsRouter from './routes/patients';
import appointmentsRouter from './routes/appointments';

const app = express();
app.use(express.json());

app.use('/patients', patientsRouter);
app.use('/appointments', appointmentsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚑 API listening on http://localhost:${PORT}`);
});


import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import expressJson from 'express';
import scanRouter from './routes/scan';




const app = express();
app.use(cors());
app.use(express.json());

app.use('/scan', scanRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

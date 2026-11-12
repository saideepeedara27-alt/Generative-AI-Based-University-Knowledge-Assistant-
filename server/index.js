import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';

const port = Number(process.env.PORT || 5001);

await connectDatabase();
app.listen(port, '127.0.0.1', () => {
  console.info(`CampusMind API is running at http://127.0.0.1:${port}`);
});

import fs from 'fs';
import path from 'path';
import { app } from './app';

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`SmartScholar backend running on http://localhost:${port}`);
});

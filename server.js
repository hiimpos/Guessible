
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.username;
    const userDir = path.join(__dirname, 'uploads', username);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ status: 'ok', filename: req.file.filename });
});

app.post('/list-files', (req, res) => {
  const username = req.body.username;
  const userDir = path.join(__dirname, 'uploads', username);
  if (!fs.existsSync(userDir)) return res.json([]);
  const files = fs.readdirSync(userDir);
  res.json(files);
});

app.get('/download/:username/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.username, req.params.filename);
  res.download(filePath);
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));

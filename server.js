const USERS_FILE = 'users.json';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (users[username]) {
    return res.status(400).json({ error: "Username already exists" });
  }

  users[username] = { password }; // Store plaintext for now (not safe in production)
  saveUsers(users);
  fs.mkdirSync(path.join(__dirname, 'uploads', username), { recursive: true });
  res.json({ status: "signed up" });
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = loadUsers();

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ status: "logged in" });
});
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

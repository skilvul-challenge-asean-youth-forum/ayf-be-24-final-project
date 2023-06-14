const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const secretKey = 'your-secret-key';

// memanggil module models
const UserModel = require('./models').User;
const ProfileModel = require('./models').Profile;
const ForumModel = require('./models').Forum;
const ForumCommentModel = require('./models').forum_comments;

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 3000

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Ganti dengan password MySQL Anda
  database: 'db_forum2' // Ganti dengan nama database yang telah Anda buat
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// endpoint untuk register user 
app.post('/register', async (req, res) => {
  try {
    // Tangkap data User dari body permintaan
    const { username, password, email } = req.body;

    // Mengenkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Menyimpan data user baru ke database
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      email
    })

    // Tangkap data Profile dari body permintaan
    const { user_id, no_hp, city, country, picture } = req.body;

    // Buat posting baru di tabel Post dan hubungkan dengan pengguna yang baru dibuat
    const newProfile = await ProfileModel.create({ user_id: newUser.id, no_hp, city, country, picture });

    res.json({ user: newUser, post: newProfile });
  } catch (error) {
    console.error('Gagal membuat akun:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// endpoint untuk login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Mencari user berdasarkan username
    const user = await UserModel.findOne({ where: { username } });

    if (!user) {
      return res.status(404).send('Username tidak ditemukan');
    }

    // Membandingkan password yang diinputkan dengan password di database menggunakan bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send('Password salah');
    }

    // Membuat token JWT
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Gagal login:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Middleware untuk memverifikasi token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak tersedia' });
  }

  jwt.verify(token, secretKey, (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }

    req.user = user;
    next();
  });
}


//   Menampilkan data forum dengna jumlah yang dibatasi per halaman
app.get('/forum', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Halaman saat ini
    const limit = 3; // Jumlah data per halaman

    const offset = (page - 1) * limit; // Offset data

    const { count, rows } = await ForumModel.findAndCountAll({
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit); // Jumlah total halaman

    res.json({
      page,
      totalPages,
      data: rows,
    });
  } catch (error) {
    console.error('Gagal mendapatkan data forum:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

//  endpoint untuk mengambil semua data kometar berdasarkan forum yang dipilih dan membutuhkan authentikasi
app.get('/forums/:id/comment', authenticateToken, async function (req, res) {
  const forum_id = req.params.id
  try {
    const ForumComments = await ForumCommentModel.findAll(
      {
      where:{
        forum_id : forum_id
      }, include: ["User","Forum"]
    } 
    );

    res.status(200).json(ForumComments);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'internal server error'
    });
  }
});



app.listen(port, () => {
  console.log(`Aplikasi berhasil dijalankan : ${port}`)
})


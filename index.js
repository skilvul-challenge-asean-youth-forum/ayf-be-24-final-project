// mengimport Library
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const multer = require('multer');

const secretKey = 'a23sx-1o4p-asd2g-asd2';
const upload = multer({ dest: 'uploads/' });

// Import models
const UserModel = require('./models').User;
const ProfileModel = require('./models').Profile;
const ForumModel = require('./models').Forum;
const ForumCommentModel = require('./models').forum_comments;
const NewsModel = require('./models').News;
const NewsCommentModel = require('./models').news_comments;

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 3000

// endpoint untuk register user 
app.post('/register', upload.single('picture'), async (req, res) => {
  try {
    // Tangkap data User dari body permintaan
    const { fullname, password, email} = req.body;
    

    // Mengenkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Menyimpan data user baru ke database
    const newUser = await UserModel.create({
      fullname,
      password: hashedPassword,
      email
    })

    // Tangkap data Profile dari body permintaan
    const { no_hp, age, city, country } = req.body;
    const imageFile = req.file; // Dapatkan file gambar dari request

    // Buat posting baru di tabel Post dan hubungkan dengan pengguna yang baru dibuat
    const newProfile = await ProfileModel.create({ user_id: newUser.id, no_hp, age, city, country, picture: imageFile.filename });

    res.json({ user: newUser, Profile: newProfile });
  } catch (error) {
    console.error('Gagal membuat akun:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// endpoint untuk login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mencari user berdasarkan email
    const user = await UserModel.findOne({ 
      where: { email }, 
      include:[{
        model: ProfileModel,
        attributes: ['picture']
      }]
     });

    //  menangkap data dari UserModel berelasi dengan profileModel
    const user_id = user.id;
    const fullname = user.fullname;
    const picture = user.Profile.picture

    if (!user) {
      return res.status(404).send('email tidak ditemukan');
    }

    // Membandingkan password yang diinputkan dengan password di database menggunakan bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send('Password salah');
    }

    // Membuat token JWT
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

    res.json({ token, email, user_id, fullname, picture });
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
app.get('/forums', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Halaman saat ini
    const limit = 6; // Jumlah data per halaman

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

// endpoint untuk mengirim data forum
app.post('/forums', upload.single('picture'), authenticateToken, async (req, res) => {
  const { author, title, descrition } = req.body;
  const imageFile = req.file; // Dapatkan file gambar dari request

  try {
    // Simpan data post ke database
    const ForumModels = await ForumModel.create({
      author,
      title,
      descrition,
      picture: imageFile.filename // Simpan nama file gambar ke dalam kolom image
    });

    return res.json({ message: 'Forum created', ForumModels });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
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
      }, include: [
        {
          model:UserModel,
          attributes:['id'],
          include:[{model:ProfileModel,attributes:['picture']}]
        }, 
        {
          model:ForumModel,
          attributes:['author','title','createdAt']
        }
      ]
    }
    );
    res.status(200).json(ForumComments);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'internal server error'
    });
  }
});

// endpoint untuk post komentar sesuai dengan forum yang dipilih
app.post('/forums/comments', authenticateToken, async function (req, res) {
  try {
    // Tangkap data User dari body permintaan
    const { comment, forum_id } = req.body;
    
    // Cari user berdasarkan id yang diperoleh dari token
    
    const user_id = await UserModel.findOne({ 
      where: { email: req.user.email }, attributes:['id'] });
      // res.json(user_id);next();
    if (!user_id) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Menyimpan data user baru ke database
    
    const postComment = await ForumCommentModel.create({
      forum_id,
      user_id,
      comment
    })

    res.json(postComment);
    
  } catch (error) {
    console.error('Gagal memposting komentar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

//  endpoint untuk mengambil semua data News
app.get('/news', async function (req, res) {
  try {
    const News = await NewsModel.findAll();

    res.status(200).json(News);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'internal server error'
    });
  }
});

//  endpoint untuk mengirim data news ke database 
app.post('/news', async function (req, res) {
  const {title, category, content, pictures} = req.body;
  try {
    const News = await NewsModel.create({
      title,
      category,
      content,
      pictures
    });

    res.json(News);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'internal server error'
    });
  }
});

// endpoint untuk post komentar sesuai dengan forum yang dipilih
app.post('/news/comments', authenticateToken, async function (req, res) {
  try {
    // Tangkap data User dari body permintaan
    const { comment, news_id } = req.body;
    
    // Cari user berdasarkan id yang diperoleh dari token
    const user_id = await UserModel.findOne({ 
      where: { email: req.user.email }, attributes:['id'] });

    if (!user_id) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Menyimpan data user baru ke database
    
    const postComment = await NewsCommentModel.create({
      news_id,
      user_id,
      comment
    })

    res.json(postComment);
    
  } catch (error) {
    console.error('Gagal memposting komentar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// endpoint untuk menangkap semua data komentar berdasarkan news
app.get('/news/:id/comments', async function (req, res) {
  const news_id = req.params.id
  try {
    const NewsComment = await NewsCommentModel.findAll(
      {
        where:{news_id:news_id},
        include:[{
          model: UserModel,
          attributes:['fullname'],
          include:[{model:ProfileModel, attributes:['picture']}]
        }]
    }
    );
    res.status(200).json(NewsComment);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'internal server error'
    });
  }
});

// endpoint untuk menghapus data user dan relasinya berdasarkan id
app.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Cari user berdasarkan ID
    const user = await UserModel.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Hapus ForumCommentModel yang berelasi dengan user
    await ForumCommentModel.destroy({ where: { user_id: userId } });
    // Hapus NewsCommentModel yang berelasi dengan user
    await NewsCommentModel.destroy({ where: { user_id: userId } });
    // Hapus profil yang berelasi dengan user
    await ProfileModel.destroy({ where: { user_id: userId } });
    // Hapus user
    await UserModel.destroy({ where: { id: userId } });

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// endpoint untuk menghapus data forum berdasarkan id
app.delete('/forums/:id', async (req, res) => {
  const  forumId  = req.params.id;

  try {
    // Cari forum berdasarkan ID
    const user = await ForumModel.findOne({ where: { id: forumId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const comment = await ForumCommentModel.findOne({ where: { forum_id: forumId } });
    // Hapus forum yang berelasi dengan ForumCommentModel
    if (!comment) {
      await ForumModel.destroy({ where: { id: forumId } });
      return res.json({ message: 'Forum deleted successfully' });
    }
    await ForumCommentModel.destroy({ where: { forum_id: forumId } });
    await ForumModel.destroy({ where: { id: forumId } });

    return res.json({ message: 'Forum deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// endpoint untuk menghapus data news berdasarkan id
app.delete('/news/:id', async (req, res) => {
  const newsId = req.params.id;

  try {
    // Cari forum berdasarkan ID
    const user = await NewsModel.findOne({ where: { id: newsId } });

    if (!user) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Hapus forum yang berelasi dengan ForumCommentModel
    const comment = await NewsCommentModel.findOne({ where: { news_id: newsId } });
    if (!comment) {
      await NewsModel.destroy({ where: { id: newsId } });
      return res.status(404).json({ message: 'News deleted succesfully' });
    }
    await NewsCommentModel.destroy({ where: { news_id: newsId } });
    await NewsModel.destroy({ where: { id: newsId } });

    return res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// endpoint untuk menghapus data komen pada forum berdasarkan id
app.delete('/forums/:id/comment', async (req, res) => {
  const  commentId = req.params.id;
  // res.json(commentId);next()
  try {
    await ForumCommentModel.destroy({ where: { id: commentId } });
    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// endpoint untuk menghapus data komen pada news berdasarkan id
app.delete('/news/:id/comment', async (req, res) => {
  const commentId = req.params.id;

  try {

    await NewsCommentModel.destroy({ where: { id: commentId } });
    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Aplikasi berhasil dijalankan : ${port}`)
})


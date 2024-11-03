require ('dotenv').config();
const express = require ('express');
const path = require ('path')
const sequelize = require ('./db');
const fs = require('fs');
const models = require('./models/models.js');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const router = require('./routes/index.js')
const errorHandler = require('./middleware/ErrorHandlingMiddleware.js')

const PORT = process.env.PORT || 6000;

const app = express();

const staticDir = path.resolve(__dirname, 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir);
}

app.use(cors({ origin: 'https://online-school-nu.vercel.app' }));
app.use(express.json());
app.use(express.static(staticDir));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).json({message: 'Working!!!'})
})

app.get('/audio/:filename', (req, res) => {
  const filePath = path.join(staticDir, req.params.filename);
  console.log('Current working directory:', process.cwd());
  console.log(filePath)
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = (end - start) + 1;
        const file = fs.createReadStream(filePath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/list-app-files', (req, res) => {
  const appDirectoryPath = path.resolve('/app');

  fs.readdir(appDirectoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan directory', error: err });
    }

    const fileList = files.map(file => {
      return {
        name: file.name,
        isDirectory: file.isDirectory()
      };
    });

    res.json(fileList);
  });
});

app.get('/list-static-files', (req, res) => {
  const staticDirectoryPath = path.resolve(__dirname, 'static'); // Путь к директории static

  fs.readdir(staticDirectoryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan directory', error: err });
    }

    const fileList = files.map(file => {
      return {
        name: file.name,
        isDirectory: file.isDirectory()
      };
    });

    res.json(fileList); // Возвращаем список файлов и папок в JSON-формате
  });
});

const start = async () => {
  try {
    sequelize.authenticate()
    sequelize.sync()
    app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
  } catch (e) {
    console.log(e)
  }
}

start();
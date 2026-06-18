const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.mimetype.startsWith('image/')) folder += 'thumbnails';
    else if (file.mimetype.startsWith('video/')) folder += 'videos';
    else if (file.mimetype === 'application/pdf') folder += 'pdfs';
    else folder += 'others';

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Type de fichier non supporté'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });

// Pour un seul fichier (ex: thumbnail)
const uploadSingle = (fieldName) => upload.single(fieldName);
// Pour deux champs (video et pdf) dans la même requête
const uploadFields = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]);

module.exports = { uploadSingle, uploadFields };
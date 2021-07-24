const multer = require('multer');

const MIMETYPE_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'video/mp4': 'mp4'
}

const INVALID_FILE_TYPE = 'Invalid file type';

const fileURL = (req, file, dest, filename) => {
  const subDest = file.mimetype.includes('image') ? 'images' : 'videos';
  const protocol = req.protocol;
  const host = req.hostname;
  const port = process.env.PORT;
  
  return `${protocol}://${host}:${port}/${subDest}/${dest}${filename}`;
}

const uploadFile = (fieldName, dest, multi = false) => {
  const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, `uploads/${dest || ''}`);
    },
    filename(req, file, callback) {
      let ext = MIMETYPE_MAP[file.mimetype];
      let filename = `${Date.now()}${Math.round(Math.random() * 1E9)}.${ext}`;

      file['fileURL'] = fileURL(req, file, dest, filename);
      callback(null, filename);
    }
  });

  const options = {
    storage,
    fileFilter(req, file, callback) {
      let error = (!MIMETYPE_MAP[file.mimetype]) 
        ? new Error(INVALID_FILE_TYPE) 
        : null;
      callback(error, error ? false : true)
    },
    limit: 800 * 800
  }
  
  const upload = !multi 
    ? multer(options).single(fieldName)
    : multer(options).array(fieldName, 8);
  
  return (req, res, next) => {
    upload(req, res, err => {
      return err 
        ? res.status(400).send({ error: err.message })
        : next();
    });
  }
}

module.exports = uploadFile;
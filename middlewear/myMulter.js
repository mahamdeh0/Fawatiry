const multer = require('multer');

const HME = (error, req, res, next) => {
  if (error) {
    res.status(400).json({ message: 'Multer error', error });
  } else {
    next();
  }
};

function myMulter(allowedTypes) {
  const storage = multer.memoryStorage();
  function fileFilter(req, file, cb) {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files are allowed"), false);
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
}

module.exports = { myMulter, HME };

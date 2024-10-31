const multer = require('multer');
const path = require('path');

// Set up storage destination and file naming convention
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Naming file with unique suffix
  }
});

// Set up multer middleware
const upload = multer({ storage: storage });

module.exports = { upload };

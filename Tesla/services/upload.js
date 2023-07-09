const multer  = require('multer')
const path = require("path");
const dir = require('../models/const')
var upload_dir = dir.upload_dir

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /pdf/;
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toString()
    );
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("Error: PDF Only!");
    }
  }
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, upload_dir)
    }
  })
  
  var upload = multer({ storage: storage , fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },});

module.exports=upload
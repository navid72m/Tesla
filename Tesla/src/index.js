// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require("path");
const multer  = require('multer')
var fs = require('fs');
const PDFWatermark= require('pdf-watermark');
// defining the Express app
const app = express();
app.use(express.json())
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.split("/")[1] === "pdf") {
//     cb(null, true);
//   } else {
//     cb(new Error("Not a PDF File!!"), false);
//   }
// };
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
    cb(null, 'uploads/')
  }
})

var upload = multer({ storage: storage , fileFilter: function (req, file, cb) {
  checkFileType(file, cb);
},});
// const upload = multer({dest : "uploads/"});

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.get('/', (req, res) => {
  res.send(ads);
});
app.post('/test', upload.any(),  async (req, res,next) => {
  
  
// var fileName = req.file.filename
console.log(req.body)
var watermark = req.body.data
var files = req.files
console.log(files[0].filename)
var fileName = files[0].filename
var originalFileName = files[0].originalname
var outputFilename = originalFileName.toLowerCase().split(' ').join('_')
var watermarkedFileName = "watermarked_"+ outputFilename
console.log(req.files)
var fs = require('fs');
fs.rename( 'uploads/'+fileName, 'uploads/'+outputFilename, function(err) {
    if ( err ) console.log('ERROR: ' + err);
});
  await PDFWatermark({
    pdf_path: "uploads/"+outputFilename, 
    text: watermark, 
    textOption:{
      diagonally:true
  },
    output_dir: "uploads/"+watermarkedFileName, // remove to override file
  });
  var file = fs.createReadStream("uploads/"+watermarkedFileName);
  var stat = fs.statSync("uploads/"+watermarkedFileName);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename='+watermarkedFileName);
  file.pipe(res);
  fs.unlink("uploads/"+outputFilename,(err) => err && console.error(err))
  fs.unlink("uploads/"+watermarkedFileName,(err) => err && console.error(err))
 



})


const cluster = require('cluster');
 
// Check the number of available CPU.
const numCPUs = require('os').cpus().length;
 

const PORT = 3001;
 
// For Master process
if (cluster.isMaster && !module.parent) {
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
 
  // This event is first when worker died
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
}
 
// For Worker
else{
 
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  if (!module.parent) {
  app.listen(PORT, err =>{
    err ?
    console.log("Error in server setup") :
    console.log(`Worker ${process.pid} started`);
  });
}
}

module.exports=app
// // starting the server
// app.listen(3001, () => {
//   console.log('listening on port 3001');
// });
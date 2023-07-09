// ./src/index.js
// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const upload = require("./services/upload")
const {watermark} = require("./services/watermark")
const processReq = require("./services/process")
const  { rename, readFile ,remove} = require("./services/storage")
var fs = require('fs');
const dir = require('./models/const')
var upload_dir = dir.upload_dir

// defining the Express app
const app = express();
app.use(express.json())
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

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

console.log("api")
console.log(req.body)
const [outputFilename, watermarkedFileName, watermark_text, fileName] =processReq(req.body.data,req.files)
console.log(req.files)




rename(fileName,outputFilename)
console.log(upload_dir+watermarkedFileName)
await watermark(upload_dir+outputFilename,watermark_text,upload_dir)

const [file,stat ]= readFile(outputFilename);
 
res.setHeader('Content-Length', stat.size);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename='+watermarkedFileName);
file.pipe(res);
  
remove(outputFilename,watermarkedFileName)
 



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
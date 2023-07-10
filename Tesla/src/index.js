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

const {check, body, matchedData, validationResult } = require('express-validator');
var fs = require('fs');
const dir = require('./models/const')



var upload_dir = dir.upload_dir


const app = express();
app.use(express.json())




app.use(helmet());


app.use(bodyParser.json());


app.use(cors());


app.use(morgan('combined'));


const validatation = [
  body('data').trim().isString().notEmpty().withMessage("Data should be non empty string!"),
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    return true;
  })
]
app.post('/test',upload.single("pdfFile"),validatation ,  async (req, res,next) => {
  
  

var result = validationResult(req);

if (!result.isEmpty()) {
  res.send(result)
   
} else {
 

  // var data = matchedData(req)
 
  const [outputFilename, watermarkedFileName, watermark_text, fileName]=processReq(req.body.data,req.file)
  rename(fileName,outputFilename)
  watermark(upload_dir+outputFilename,watermark_text,upload_dir)
  
  console.log(upload_dir+watermarkedFileName)
  
  
  
  setTimeout(()=>{
    const [file,stat ]= readFile(outputFilename);
  
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename='+watermarkedFileName);
  file.pipe(res);
  
  },3000)
    
  setTimeout(()=>{remove(outputFilename,fileName)},3000)
    
  
}





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

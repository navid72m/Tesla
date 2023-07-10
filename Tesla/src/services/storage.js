const fs = require('fs')
const dir = require('../models/const')

var upload_dir = dir.upload_dir

function rename(fileName,outputFilename){
    console.log("RENAME")
    fs.rename( upload_dir+fileName, upload_dir+outputFilename, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    });
}

 function readFile(watermarkedFileName){
    console.log("readfile")
    var file = fs.createReadStream(upload_dir+watermarkedFileName);
    var stat = fs.statSync(upload_dir+watermarkedFileName);
    return [file, stat]
}

function remove(outputFilename, watermarkedFileName){
  console.log("remove")
  fs.unlink(upload_dir+outputFilename,(err) => err && console.error(err))
  
//   fs.unlink(upload_dir+watermarkedFileName,(err) => err && console.error(err))
}

module.exports = {
    rename : rename,
    readFile : readFile,
    remove : remove
}
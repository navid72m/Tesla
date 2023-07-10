
function processReq(data,file){
    let watermark_text = data;
   

    var fileName = file.filename
    var originalFileName = file.originalname

    var outputFilename = originalFileName.toLowerCase().split(' ').join('_')
    var watermarkedFileName = "watermarked_"+ outputFilename

    return [outputFilename, watermarkedFileName, watermark_text, fileName]
}


module.exports= processReq








function processReq(data,files){
    let watermark_text = data;
    let files_arr = files;

    var fileName = files[0].filename
    var originalFileName = files[0].originalname

    var outputFilename = originalFileName.toLowerCase().split(' ').join('_')
    var watermarkedFileName = "watermarked_"+ outputFilename

    return [outputFilename, watermarkedFileName, watermark_text, fileName]
}


module.exports= processReq







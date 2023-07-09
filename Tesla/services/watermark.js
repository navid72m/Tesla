const PDFWatermark= require('pdf-watermark');

function watermark(pdf_path,text,output_dir){
console.log("watermakr")
    PDFWatermark({
        pdf_path: pdf_path, 
        text: text, 
        textOption:{
          diagonally:true
      },
        output_dir: output_dir, // remove to override file
      });


}

module.exports=watermark

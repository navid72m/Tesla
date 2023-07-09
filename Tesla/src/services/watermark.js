const PDFWatermark= require('pdf-watermark');

async function watermark(pdf_path,text){
console.log("watermakr")
// console.log(output_dir)
try {
    await PDFWatermark({
        pdf_path: pdf_path, 
        text: text, 
        textOption:{
          diagonally:true
        }

    //     output_dir: output_dir, // remove to override file
      });

    }
    catch (err){
        console.log(err)
    }


}

module.exports={watermark : watermark}

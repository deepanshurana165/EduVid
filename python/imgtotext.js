const Tesseract = require('tesseract.js');
const fs = require('fs');
Tesseract.recognize('./sample.jpg')
       .progress(function  (p) { console.log('progress', p)    })
       .then(function (result) { 
            text = result.text;
            console.log('result', text);
            fs.writeFile('sample.txt',text,;
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument;
            doc.pipe(fs.createWriteStream('sample.pdf'));
            doc.text(text);
            console.log('result2', text);
            doc.end();
            Tesseract.terminate();
})
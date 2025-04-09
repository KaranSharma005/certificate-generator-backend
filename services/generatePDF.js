const path = require('path');
const PizZip = require('pizzip');
const fs = require('fs');
const Docxtemplater = require("docxtemplater");
const convertPdf = require('docx-pdf');

async function convertWordToPdf(filePath,pdfPath){
    await new Promise((resolve, reject) => {
        convertPdf(filePath, pdfPath, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function handleFileGeneration(jsondata,wordFile,io,allfields,socketId){
    for (let i = 0; i < jsondata.length; i++) {
        const user = jsondata[i];
        const wordData = fs.readFileSync(wordFile.path, 'binary');
        const zip = new PizZip(wordData);
        const document = new Docxtemplater(zip);

        const emptyfield=allfields.some(field=>{
            const value=user[field];
            if(value==undefined||value==null||value==''){
              return true;
            }
            else{
              return false;
            }
        });
        if(emptyfield){
            console.log(emptyfield);
            continue;
        }

        document.render(user);

        const buf = document.getZip().generate({ type: 'nodebuffer' });
        const fileName = `${user.Name}${Date.now()}.docx`;
        const pdfFileName = `${user.RollNo}${Date.now()}.pdf`;
        const filePath = path.join('./certificates', fileName);
        const pdfPath = path.join('./certificates', pdfFileName);
        fs.writeFileSync(filePath, buf);

        await convertWordToPdf(filePath,pdfPath);

        fs.unlinkSync(filePath);

        io.to(socketId).emit('certificate-progress', {
            name:user.Name,
            url:`http://localhost:3000/certificates/${pdfFileName}`
        });
    }
}

module.exports = {
    handleFileGeneration,
}

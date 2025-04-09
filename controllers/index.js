const path = require('path');
const xlsx = require('xlsx');
const PizZip = require('pizzip');
const fs = require('fs');
const Docxtemplater = require("docxtemplater");

const generateCertificates = async (req, res) => {
    const io = req.app.get('io');
    const socketId = req.body.socketId;

    const excelFile = req.files.excelFile[0];
    const wordFile = req.files.wordFile[0];

    const allowedExcelTypes = [".xls", ".xlsx"];
    const allowedWordTypes = [".doc", ".docx"];

    if (!excelFile || !allowedExcelTypes.includes(path.extname(excelFile.originalname).toLowerCase())) {
        return res.status(400).json({ error: "error", message: "Upload a valid Excel file." });
    }
    if (!wordFile || !allowedWordTypes.includes(path.extname(wordFile.originalname).toLowerCase())) {
        return res.status(400).json({ error: "error", message: "Upload a valid Word template file." });
    }

    try {
        const workbook = xlsx.readFile(excelFile.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsondata = xlsx.utils.sheet_to_json(worksheet);

        for (let i = 0; i < jsondata.length; i++) {
            const user = jsondata[i];
            const wordData = fs.readFileSync(wordFile.path, 'binary');
            const zip = new PizZip(wordData);
            const document = new Docxtemplater(zip);

            document.render({
                Name: user.Name,
                RollNo: user.RollNo,
                RegNo: user.RegNo,
                School: user.School,
            });

            const buf = document.getZip().generate({ type: 'nodebuffer' });
            const fileName = `${user.Name}${Date.now()}.docx`;
            const filePath = path.join('./certificates', fileName);
            fs.writeFileSync(filePath, buf);

            io.to(socketId).emit('certificate-progress', {
                name:user.Name,
                url:`http://localhost:3000/certificates/${fileName}`
            });
        }
        return res.status(200).json({ message: "Uploaded Successfully" });

    } catch (err) {
        console.error("Error caught during generation:", err);
        return res.status(500).json({ error: "error", message: "Internal Server Error" });
    }
};

module.exports = {
    generateCertificates
};

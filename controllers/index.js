const path = require('path');
const xlsx = require('xlsx');
const {handleFileGeneration} = require('../services/generatePDF')

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

    const email = req.email?.email;
    
    try {
        const workbook = xlsx.readFile(excelFile.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsondata = xlsx.utils.sheet_to_json(worksheet);
        const allfields=Object.keys(jsondata[0]);

        await handleFileGeneration(jsondata,wordFile,io,allfields,socketId);
        return res.status(200).json({ message: "Uploaded Successfully" });

    } catch (err) {
        console.error("Error caught during generation:", err);
        return res.status(500).json({ error: "error", message: "Internal Server Error" });
    }
};

module.exports = {
    generateCertificates
};

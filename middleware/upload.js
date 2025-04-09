const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req,file,cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage ,
    limits: { 
        fileSize: 1024 * 1024 * 5
    },
})

module.exports = upload.fields([
    { name: 'excelFile', maxCount: 1 },
    { name: 'wordFile', maxCount: 1 }
]);
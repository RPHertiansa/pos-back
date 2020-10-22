const multer = require('multer')
//const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/upload');
    },
    filename: (req, file, cb) => {        
        cb(null, `${file.fieldname}+${Date.now()}.jpg`)
    }
});

const upload = multer ({
    storage,
    limits: { fileSize: 5000000 },
    fileFilter(req, file, callback) {
        if (file.originalname.match(/\.(jpg|jpeg)\b/)) {
            callback(null, true)
        } else {
            callback('Image type must be JPG or JPEG', null)
        }
    }
})

module.exports = upload
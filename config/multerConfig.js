const multer = require('multer');




module.exports = (path) => {
    
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path + '/uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    var upload = multer({storage: storage});
    
    return upload;
}
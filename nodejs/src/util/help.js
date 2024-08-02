const multer = require("multer")
const fs = require("fs")

const Config = {
    image_path : "C:/xampp/htdocs/Project/e-commerce-img/"
}

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req,file,callback){
            callback(null, Config.image_path)
        },
        filename: function(req,file,callback){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            callback(null, file.fieldname + '-' + uniqueSuffix)
        }
    }),
    limits: {
        fileSize : (1024 * 1024) * 3 // equal 3Mb
    },
    fileFilter: function (req, file, callback) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
})

const removeFile = (fileName) => {
    var filePath = Config.image_path + fileName
    try {
        return fs.unlinkSync(filePath)
    } catch (err) {
        return false
    }
}


module.exports = {
    upload,
    removeFile
}
import multer from 'multer'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file, "--fileeeeeeeee--")
        if(file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
            cb(null, 'public/image')
            return
        }
        cb(null,'public/delete')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname)
    }
})

export default storage
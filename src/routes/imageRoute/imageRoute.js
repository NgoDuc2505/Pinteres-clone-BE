import express from 'express'
import { getListImgHandler, postImgHandler } from '../../controllers/imageController/imageController.js'
import multer from 'multer'
import storage from '../../config/multerConfig.js'
const upload = multer({ storage })

const imageRoute = express.Router()

imageRoute.get('/getListImg', getListImgHandler)
imageRoute.post('/postImg/:userId', upload.single("img"), postImgHandler)






export default imageRoute
import express from 'express'
import { getListImgHandler, postImgHandler, editImgContentHandler, changedImgHandler } from '../../controllers/imageController/imageController.js'
import multer from 'multer'
import storage from '../../config/multerConfig.js'
const upload = multer({ storage })

const imageRoute = express.Router()

imageRoute.get('/getListImg', getListImgHandler)
imageRoute.post('/postImg/:userId', upload.single("img"), postImgHandler)
imageRoute.put('/editImg/:imgId', editImgContentHandler)
imageRoute.put('/changedImg/:imgId', upload.single("imgChange"), changedImgHandler)




export default imageRoute
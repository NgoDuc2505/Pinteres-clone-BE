import express from 'express'
import { getListImgHandler, postImgHandler, editImgContentHandler, changedImgHandler, deleteImgHandler, findImgByNameHandler } from '../../controllers/imageController/imageController.js'
import multer from 'multer'
import storage from '../../config/multerConfig.js'
const upload = multer({ storage })

const imageRoute = express.Router()

imageRoute.get('/getListImg', getListImgHandler)
imageRoute.post('/postImg/:userId', upload.single("img"), postImgHandler)
imageRoute.put('/editImg/:imgId', editImgContentHandler)
imageRoute.put('/changedImg/:imgId', upload.single("imgChange"), changedImgHandler)
imageRoute.delete('/deleteImg/:imgId', deleteImgHandler)
imageRoute.get('/findImgByName', findImgByNameHandler)


export default imageRoute
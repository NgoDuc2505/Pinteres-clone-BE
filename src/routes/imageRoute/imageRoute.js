import express from 'express'
import { getListImgHandler, postImgHandler, editImgContentHandler, changedImgHandler, deleteImgHandler, findImgByNameHandler, savedImgHandler, removeSavedHandler, getListSavedImgByUserHandler, getImgDetailHandler} from '../../controllers/imageController/imageController.js'
import multer from 'multer'
import storage from '../../config/multerConfig.js'
import { authentication, checkUserDidLogin } from '../../services/jwt/JWTservices.js'
const upload = multer({ storage })

const imageRoute = express.Router()

imageRoute.all('*',checkUserDidLogin,authentication)

imageRoute.get('/getListImg', getListImgHandler)
imageRoute.get('/getImgDetail/:imgId', getImgDetailHandler)
imageRoute.post('/postImg/:userId', upload.single("img"), postImgHandler)
imageRoute.put('/editImg/:imgId', editImgContentHandler)
imageRoute.put('/changedImg/:imgId', upload.single("imgChange"), changedImgHandler)
imageRoute.delete('/deleteImg/:imgId', deleteImgHandler)
imageRoute.get('/findImgByName', findImgByNameHandler)
imageRoute.post('/savedImg/:userId/:imgId', savedImgHandler)
imageRoute.delete('/removeSaved/:savedId', removeSavedHandler)
imageRoute.get('/getListSavedImgByUser/:userId', getListSavedImgByUserHandler)

export default imageRoute
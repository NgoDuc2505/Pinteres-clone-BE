import express from 'express'
import { registerHandler, loginHandler, getUserHandler, getUserByIdHandler, updateProfileHandler, deleteUserHandler, getListByPageHandler, deleteUserHandlerV2 } from '../../controllers/userController/userController.js'
import multer from 'multer'
import { authentication, checkUserDidLogin } from '../../services/jwt/JWTservices.js'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})
const upload = multer({ storage })


const userRoute = express.Router()
userRoute.all('*',checkUserDidLogin,authentication)

userRoute.post('/register', registerHandler)
userRoute.post('/login', loginHandler)

userRoute.get('/getListUser',getUserHandler)
userRoute.get('/getUserById/:userId', getUserByIdHandler)
userRoute.put('/updateProfile/:userId', upload.single('avatar'), updateProfileHandler)
userRoute.delete('/deleteUser/:userId', deleteUserHandlerV2),
userRoute.get('/getListByPage/:pageSize/:pageIndex', getListByPageHandler)

export default userRoute
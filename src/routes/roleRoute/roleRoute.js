import express from 'express'
import { getRoleHandler, getRoleByIDHandler } from '../../controllers/roleController/roleController.js'
import { authentication, checkUserDidLogin } from '../../services/jwt/JWTservices.js'

const roleRoute = express.Router()
roleRoute.all('*',checkUserDidLogin,authentication)

roleRoute.get('/getRole', getRoleHandler)
roleRoute.get('/getRoleByID/:idRole', getRoleByIDHandler)
export default roleRoute
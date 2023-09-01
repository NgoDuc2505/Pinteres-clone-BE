import express from 'express'
import { getRoleHandler, getRoleByIDHandler } from '../../controllers/roleController/roleController.js'

const roleRoute = express.Router()
roleRoute.get('/getRole', getRoleHandler)
roleRoute.get('/getRoleByID/:idRole', getRoleByIDHandler)
export default roleRoute
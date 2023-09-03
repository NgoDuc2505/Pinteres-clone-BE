import express from 'express'
import roleRoute from './roleRoute/roleRoute.js'
import userRoute from './userRoute/userRoute.js'
import imageRoute from './imageRoute/imageRoute.js'

const rootRoute = express.Router()
rootRoute.use('/role', roleRoute)
rootRoute.use('/user', userRoute)
rootRoute.use('/img', imageRoute)

export default rootRoute
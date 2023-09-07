import express from 'express'
import roleRoute from './roleRoute/roleRoute.js'
import userRoute from './userRoute/userRoute.js'
import imageRoute from './imageRoute/imageRoute.js'
import commentRoute from './commentRoute/commentRoute.js'

const rootRoute = express.Router()
rootRoute.use('/role', roleRoute)
rootRoute.use('/user', userRoute)
rootRoute.use('/img', imageRoute)
rootRoute.use('/comment', commentRoute)

export default rootRoute
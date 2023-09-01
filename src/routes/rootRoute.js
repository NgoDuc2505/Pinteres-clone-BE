import express from 'express'
import roleRoute from './roleRoute/roleRoute.js'
import userRoute from './userRoute/userRoute.js'

const rootRoute = express.Router()
rootRoute.use('/role', roleRoute)
rootRoute.use('/user', userRoute)

export default rootRoute
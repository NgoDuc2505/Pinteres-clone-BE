import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { failure } from '../../config/response.js'
dotenv.config()

const createToken = (data) => {
    let result = null
    try {
        const token = jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: "2 days" })
        result = token
        return result
    } catch (error) {
        return result
    }
}

const verifyToken = (token) => {
    let result = null
    try {
        const decode = jwt.verify(token, process.env.PRIVATE_KEY)
        result = decode
        return result
    } catch (error) {
        return result
    }
}

const checkUserDidLogin = (req,res,next) => {
    try{
        const cookie = req.signedCookies
        if(cookie.token){
            const decode = verifyToken(cookie.token)
            console.log(decode)
            next()
            return 
        }
        failure(res,400,"You have to login!")
    }catch(error){
        console.log(error)
    }
}

export { createToken, verifyToken, checkUserDidLogin }

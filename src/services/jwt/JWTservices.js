import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { failure } from '../../config/response.js'
import { getRoleByEmail } from '../user/userService.js'
import { PrismaClient } from '@prisma/client'
dotenv.config()

const prisma = new PrismaClient()

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

const noneSecurePath = (path) => {
    const nonePath = ['/login', '/register']
    if (nonePath.includes(path)) {
        return true;
    }
    return false
}

const checkUserDidLogin = (req, res, next) => {
    try {
        if (noneSecurePath(req.path)) {
            console.log(">>>>>> nonsecurePath: ", req.path)
            next()
            return
        }
        const cookie = req.signedCookies
        if (cookie.token) {
            const decode = verifyToken(cookie.token)
            req.userData = decode
            console.log(req.userData)
            next()
            return
        }
        failure(res, 400, "You have to login!")
    } catch (error) {
        console.log(error)
    }
}

const authentication = async (req, res, next) => {
    try {
        if (noneSecurePath(req.path)) {
            // console.log(">>>>>> nonsecurePath: ", req.path)
            next()
            return
        }
        const userAuthen = req.userData
        const emailFromUserData = userAuthen.email
        const getRoleFromEmail = await getRoleByEmail(emailFromUserData)
        const listOfRole = getRoleFromEmail.roleList.join(",")
        const fullListRoleArray = listOfRole.split(",")
        const customPath = "/"+ req.path.split("/")[1]
        // console.log(">>>> log req user: ", getRoleFromEmail)
        // console.log(">>>> list role", fullListRoleArray)
        // console.log(">>>> current path: ", customPath)
        if(fullListRoleArray.some((item)=>item === customPath)){
            console.log(">>> This role have access!!")
            next()
            return
        }
        failure(res, 400, "You are not permitted !")
    } catch (error) {
        console.log(error)
    }
}

export { createToken, verifyToken, checkUserDidLogin, authentication }

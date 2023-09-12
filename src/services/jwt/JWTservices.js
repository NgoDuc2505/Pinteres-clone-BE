import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const createToken = (data) => {
    let result = null
    try {
        const token = jwt.sign(data, process.env.PRIVATE_KEY, { expiresIn: "2 days" })
        result = token
        return result
    } catch (error) {
        console.log(error)
        return result
    }
}

const verifyToken = (token) => {
    let result = null
    try{
        const decode = jwt.verify(token,process.env.PRIVATE_KEY)
        result = decode
        return result
    }catch(error){
        console.log(error)
        return result
    }
}

export { createToken, verifyToken }

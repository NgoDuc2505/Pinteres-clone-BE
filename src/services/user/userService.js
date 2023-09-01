import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import compress_images from 'compress-images'
import fs from 'fs'

const salt = bcrypt.genSaltSync(10);
const prisma = new PrismaClient()

const hashPass = (password) => {
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword
}

const checkHash = (password, hash) => {
    return bcrypt.compareSync(password, hash)

}

const checkUserExit = async (email) => {
    const checkEmail = await prisma.user_login.findMany({
        where: {
            email
        }
    })
    return checkEmail
}

const excludeForArr = (user, keys) => {
    const excludeResult = user.map((item)=>{
         return Object.fromEntries(
            Object.entries(item).filter(([key]) => !keys.includes(key))
        );
    })
    return excludeResult
}

const exclude = (user, keys) => {
    return Object.fromEntries(
       Object.entries(user).filter(([key]) => !keys.includes(key))
   );
}

const createUser = async (hashPassword, email, age, fullName) => {
    try {
        let isExit = await checkUserExit(email)
        if (isExit.length > 0) {
            return {
                user: "",
                loginInfo: ""
            }
        }
        const userLogin = await prisma.user_login.create({
            data: {
                email,
                password: hashPassword,
            }
        })
        const loginId = userLogin.user_login_id
        const userInfo = await prisma.users.create({
            data: {
                age,
                full_name: fullName,
                role_id: 2,
                user_login_id: loginId
            }
        })
        const userLoginExclude = exclude(userLogin,['facebook_app_id','password'])
        const userInfoExclude = exclude(userInfo,['isDeleted'])
        const dataResult = {
            user: userInfoExclude,
            loginInfo: userLoginExclude
        }
        return dataResult
    } catch (err) {
        console.log(err)
    }

}

const findUserById = async (id) => {
    try {
        const userId = await prisma.users.findUnique({
            where: {
                user_id: Number(id),
                isDeleted: null
            }
        })
        if(userId){
            const result = exclude(userId,['isDeleted'])
            return result
        }
        return undefined
    } catch (error) {
        console.log(error)
    }
}

const uploadImg = async (fileName) => {
    await compress_images(`public/image/${fileName}`, 'public/file/', { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "25"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
            fs.unlink(process.cwd() + `/public/image/${fileName}`, (err) => { console.log(err) })
        }
    );
}

const oldAvatarHandler = (fileName) => {
    if (fileName) {
        fs.unlink(process.cwd() + `/public/file/${fileName}`, (err) => { console.log(err) })
    }
}

const checkPageAvailable = (originData,pageSize) =>{
    return Math.ceil(originData.length / +pageSize)
}


export { hashPass, createUser, checkUserExit, checkHash, findUserById, uploadImg, oldAvatarHandler, excludeForArr, checkPageAvailable}
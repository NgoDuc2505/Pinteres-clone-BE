import { PrismaClient } from '@prisma/client'
import { getCurrentImg } from '../img/imgServices.js'

const prisma = new PrismaClient()

const checkSaved = async (userId, imgId) => {
    try{
        const checkListSaved = await prisma.saved_image.findMany({
            where: {
                user_id: +userId,
                image_id: +imgId
            }
        })
        if (checkListSaved.length > 0) {
            return true
        }
        return false
    }catch(error){
        console.log(error)
    }
}

const checkDidCreated = async (userId, imgId) => {
    try{
        const currentImg = await getCurrentImg(imgId)
        if(currentImg.user_id === +userId){
            return true
        }
        return false
    }catch(error){
        console.log(error)
    }
}

export { checkSaved, checkDidCreated }
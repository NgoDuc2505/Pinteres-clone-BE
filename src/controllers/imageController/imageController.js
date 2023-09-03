import { PrismaClient } from '@prisma/client'
import { serverError, success, failure } from '../../config/response.js'

const prisma = new PrismaClient()

const getListImgHandler = async (req, res) => {
    try {
        const imgList = await prisma.images.findMany({
           include:{
            users: {
                select : {
                    full_name : true
                }
            }
           }
        })
        success(res, imgList)
    } catch (err) {
        console.log(err)
        serverError(res)
    }
}

const postImgHandler = async (req, res) => {
    try {
        const { userId } = req.params
        const { name, descr } = req.body
        const file = req.file
        if (file) {
            const createdPost = await prisma.images.create({
                data: {
                    user_id: +userId,
                    link_url: file?.filename,
                    descr,
                    name
                }
            })
            success(res, createdPost)
            return
        }
        failure(res, 404, "You haven't imported your image!")
    } catch (err) {
        console.log(err)
        serverError(res)
    }
}

export { getListImgHandler, postImgHandler }
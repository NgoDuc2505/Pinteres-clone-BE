import { PrismaClient } from '@prisma/client'
import { serverError, success, failure } from '../../config/response.js'
import { uploadImg, checkIsValidMimetype, getCurrentImg } from '../../services/img/imgServices.js'
import fs from 'fs'

const prisma = new PrismaClient()

const getListImgHandler = async (req, res) => {
    try {
        const imgList = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        full_name: true
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
            if (!checkIsValidMimetype(file, res)) {
                failure(res, 400, "File is not a valid image mimetype (.jpg, .png)")
                return
            }
            const createdPost = await prisma.images.create({
                data: {
                    user_id: +userId,
                    link_url: file?.filename,
                    descr,
                    name
                }
            })
            uploadImg(file.filename)
            success(res, createdPost)
            return
        }
        failure(res, 404, "You haven't imported your image!")
    } catch (err) {
        console.log(err)
        serverError(res)
    }
}

const editImgContentHandler = async (req, res) => {
    try {
        const { imgId } = req.params
        const { name, descr } = req.body
        const prevPost = await prisma.images.findUnique({
            where: {
                image_id: +imgId
            }
        })
        let nameUpdate = name ? name : prevPost.name
        let descrUpdate = descr ? descr : prevPost.descr
        const updatedPost = await prisma.images.update({
            where: {
                image_id: +imgId
            },
            data: {
                name: nameUpdate,
                descr: descrUpdate,
            }
        })
        success(res, { prevPost, updatedPost })
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const changedImgHandler = async (req, res) => {
    try {
        const { imgId } = req.params
        const file = req.file
        const currentImg = await getCurrentImg(imgId)
        if (file) {
            if (!checkIsValidMimetype(file)) {
                failure(res, 400, "File is not a valid image mimetype (.jpg, .png)")
                return
            }
            const updatedImage = await prisma.images.update({
                where: {
                    image_id: +imgId
                },
                data: {
                    link_url: file.filename
                }
            })
            fs.unlinkSync(process.cwd() + `/public/imgStorage/${currentImg.link_url}`, (err) => { console.log(err) })
            uploadImg(file.filename)
            success(res, { prevImg: currentImg.link_url, updatedImage: updatedImage.link_url })
            return
        }
        failure(res, 404, "You haven't imported your image!")
    } catch (err) {
        console.log(err)
        serverError(res)
    }
}

const deleteImgHandler = async (req, res) => {
    try {
        const { imgId } = req.params
        const currentImg = await getCurrentImg(imgId)
        const deletedImage = await prisma.images.delete({
            where: {
                image_id: +imgId
            }
        })
        fs.unlinkSync(process.cwd() + `/public/imgStorage/${currentImg.link_url}`, (err) => { console.log(err) })
        success(res, deletedImage)
    } catch (err) {
        console.log(err)
        serverError(res)
    }
}

export { getListImgHandler, postImgHandler, editImgContentHandler, changedImgHandler, deleteImgHandler }
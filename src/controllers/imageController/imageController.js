import { PrismaClient } from '@prisma/client'
import { serverError, success, failure } from '../../config/response.js'
import { uploadImg, checkIsValidMimetype, getCurrentImg } from '../../services/img/imgServices.js'
import fs from 'fs'
import { checkSaved, checkDidCreated } from '../../services/savedImg/savedImgService.js'

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

const getImgDetailHandler = async (req, res) => {
    try {
        const { imgId } = req.params
        const data = await prisma.images.findUnique({
            where: {
                image_id: +imgId
            },
            include: {
                users: {
                    select: {
                        full_name: true,
                        avatar: true,
                        user_id: true
                    }
                }

            }
        })
        success(res, data)
    } catch (error) {
        console.log(error)
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
                    name,
                    created_date: new Date()
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

const findImgByNameHandler = async (req, res) => {
    try {
        const { imgName } = req.body
        const result = await prisma.images.findMany({
            where: {
                name: {
                    contains: imgName
                }
            }
        })
        success(res, result)
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const savedImgHandler = async (req, res) => {
    try {
        const { userId, imgId } = req.params
        //check this image is your own
        if (await checkDidCreated(userId, imgId)) {
            failure(res, 400, "Can't save this image! [01]")
            return
        }
        //check did you saved this img before
        if (await checkSaved(userId, imgId)) {
            failure(res, 400, "Can't save this image! [02]")
            return
        }
        const result = await prisma.saved_image.create({
            data: {
                saved_date: new Date(),
                image_id: +imgId,
                user_id: +userId
            }
        })
        success(res, result)
    } catch (err) {
        console.log(err)
        serverError(res)
    }
}

const removeSavedHandler = async (req, res) => {
    try {
        const { savedId } = req.params
        const removeSaved = await prisma.saved_image.delete({
            where: {
                saved_image_id: +savedId
            }
        })
        success(res, removeSaved, "removed")
    } catch {
        serverError(res)
    }
}

const getListSavedImgByUserHandler = async (req, res) => {
    try {
        const { userId } = req.params
        const listData = await prisma.saved_image.findMany({
            where: {
                user_id: +userId
            },
            include: {
                images: {
                    select: {
                        link_url: true,
                        descr: true,
                        name: true,
                        created_date: true,
                        users: {
                            select: {
                                user_id: true,
                                full_name: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        })
        success(res, listData)
    } catch {
        serverError(res)
    }
}

export { getListImgHandler, postImgHandler, editImgContentHandler, changedImgHandler, deleteImgHandler, findImgByNameHandler, savedImgHandler, removeSavedHandler, getListSavedImgByUserHandler, getImgDetailHandler }
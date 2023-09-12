import { PrismaClient } from '@prisma/client'
import { serverError, success, failure } from '../../config/response.js'
import { checkPostExits, filterDeletedUser, checkAbilityToUpdate } from '../../services/comment/commentService.js'

const prisma = new PrismaClient()

const postCommentHandler = async (req, res) => {
    try {
        const { postId } = req.params
        const { user_id, content } = req.body
        if (await checkPostExits(postId)) {
            const comment = await prisma.comments.create({
                data: {
                    user_id,
                    image_id: +postId,
                    content,
                    date_comment: new Date()
                }
            })
            success(res, comment)
            return
        }
        failure(res, 400, "This post isn't exit at this time!")
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const getPostCommentHandler = async (req, res) => {
    try {
        const { postId } = req.params
        const commentById = await prisma.comments.findMany({
            where: {
                image_id: +postId
            },
            include: {
                users: {
                    select: {
                        avatar: true,
                        full_name: true,
                        isDeleted: true
                    }
                }
            }
        })
        const result = filterDeletedUser(commentById)
        success(res, result)
    }
    catch {
        serverError(res)
    }
}

const updateContentHandler = async (req, res) => {
    try {
        const { commentId } = req.params
        const { content, userId } = req.body
        if (await checkAbilityToUpdate(commentId, userId)) {
            const updatedComment = await prisma.comments.update({
                where: {
                    comment_id: +commentId
                },
                data: {
                    content
                }
            })
            success(res, updatedComment)
            return
        }
        failure(res, 400, "this user can not change content of this comment!")
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const deleteCommentHandler = async (req, res) => {
    try {
        const { commentId } = req.params
        const { userId } = req.body
        if (await checkAbilityToUpdate(commentId, userId)) {
            const deletedComment = await prisma.comments.delete({
                where: {
                    comment_id: +commentId
                }
            })
            success(res, deletedComment)
            return
        }
        failure(res, 400, "this user can not delete this comment!")
    } catch {
        serverError(res)
    }
}
export { postCommentHandler, getPostCommentHandler, updateContentHandler, deleteCommentHandler }
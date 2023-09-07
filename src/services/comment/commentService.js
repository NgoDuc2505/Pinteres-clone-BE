import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const checkPostExits = async (postId) => {
    try {
        const img = await prisma.images.findMany({
            where: {
                image_id: +postId
            }
        })
        if (img.length > 0) {
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

const filterDeletedUser = (data) => {
    try {
        return data.filter((item) => {
            return item?.users?.isDeleted == null
        })
    } catch (error) {
        console.log(error)
    }
}

const checkAbilityToUpdate = async (commentId, userId) => {
    try {
        const currentComment = await prisma.comments.findUnique({
            where: {
                comment_id: +commentId
            }
        })
        if (currentComment.user_id === +userId) {
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

export { checkPostExits, filterDeletedUser, checkAbilityToUpdate }

import { serverError, success, failure } from '../../config/response.js'
import { createUser, hashPass, checkUserExit, checkHash, findUserById, uploadImg, oldAvatarHandler, excludeForArr, checkPageAvailable } from '../../services/user/userService.js'
import config from '../../config/prismaConfig.js'

const prisma = config()


const registerHandler = async (req, res) => {
    try {
        const { email, password, age, fullName } = req.body
        const hashPassword = hashPass(password)
        let dataResult = await createUser(hashPassword, email, age, fullName)
        if (dataResult.user == "") {
            failure(res, 400, "register failed: Try another email!")
            return
        }
        success(res, dataResult, "register successfully")
    } catch (err) {
        console.log(err)
        serverError(res)
    }

}

const loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        const checkingExitUser = await checkUserExit(email)
        if (checkingExitUser.length > 0) {
            const hashPass = checkingExitUser[0].password
            checkHash(password, hashPass)
                ? success(res, {
                    token: "",
                    role: "role"
                })
                : failure(res, 404, "incorrect password!")

            return
        }
        failure(res, 404, "incorrect email!")
    } catch {
        serverError(res)
    }
}

const getUserHandler = async (req, res) => {
    try {
        const userList = await prisma.users.findMany({
            where: {
                isDeleted: null
            }
        })
        const userWithoutDeleted = excludeForArr(userList, ['isDeleted'])
        success(res, userWithoutDeleted, "get list successfully")
    } catch {
        serverError(res)
    }
}

const getUserByIdHandler = async (req, res) => {
    try {
        const { userId } = req.params
        const userDetail = await findUserById(userId)
        if (userDetail) {
            success(res, userDetail, "get detail user successfully")
            return
        }
        failure(res, 404, "Failed: Can not get this user")
    } catch (error) {
        serverError(res)
    }
}

const updateProfileHandler = async (req, res) => {
    try {
        const { userId } = req.params
        const file = req.file
        let prevUser = await findUserById(userId)
        if (file !== undefined) {
            await uploadImg(file.filename)
            oldAvatarHandler(prevUser.avatar)
        }
        const { descr, own_website } = req.body
        const updatedUser = await prisma.users.update({
            where: {
                user_id: +userId
            },
            data: {
                avatar: file?.filename,
                descr,
                own_website,
            }
        })
        success(res, { updatedUser, prevUser }, "updated successfully")
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const deleteUserHandler = async (req, res) => {
    //traditional soft delete 
    try {
        const { userId } = req.params
        const deletedUser = await prisma.users.update({
            where: {
                user_id: +userId
            },
            data: {
                isDeleted: new Date()
            }

        })
        success(res, deletedUser.isDeleted, "deleted")
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const deleteUserHandlerV2 = async (req, res) => {
    //using soft delete middleware
    try {
        const { userId } = req.params
        const deletedUser = await prisma.users.delete({
            where: {
                user_id: +userId
            }
        })
        success(res, deletedUser, "deleted")
    } catch (error) {
        console.log(error)
        serverError(res)
    }
}

const getListByPageHandler = async (req, res) => {
    try {
        const { pageIndex, pageSize } = req.params
        const listUser = await prisma.users.findMany({
            skip: (+pageIndex - 1) * +pageSize,
            take: +pageSize,
            where: {
                isDeleted: null
            }
        })
        const originData = await prisma.users.findMany({ where: { isDeleted: null } })
        const pageAvailable = checkPageAvailable(originData, pageSize)
        success(res, { listUser, page: pageIndex, pageAvailable })
    } catch {
        serverError(res)
    }
}

export { registerHandler, loginHandler, getUserHandler, getUserByIdHandler, updateProfileHandler, deleteUserHandler, getListByPageHandler, deleteUserHandlerV2 }
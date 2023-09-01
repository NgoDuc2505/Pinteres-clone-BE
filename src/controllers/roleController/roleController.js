import { PrismaClient } from '@prisma/client'
import { serverError, success } from '../../config/response.js'

const prisma = new PrismaClient()

const getRoleHandler = async (req, res) => {
    try {
        const data = await prisma.group_roles.findMany({
            select: {
                group_roles_id: true,
                role: true,
                detail_role: true,
                detail_id: false,
                role_id: false
            }
        })
        success(res, data)
    } catch {
        serverError(res)
    }
}

const getRoleByIDHandler = async (req, res) => {
    try {
        const { idRole } = req.params
        const data = await prisma.group_roles.findMany({
            where: {
                role_id: +idRole
            },
            select: {
                role_id: true,
                group_roles_id: true,
                role: true,
                detail_role: true,
                detail_id: false,
            }
        })
        const role_name = data[0].role.role_name
        const roleList = data.map((item) => { return { id: item.detail_role.detail_id, name: item.detail_role.name } })
        const result = {
            role_id: idRole,
            role_name,
            roleList,
        }
        success(res, result)
    } catch {
        serverError(res)
    }
}

export { getRoleHandler, getRoleByIDHandler }
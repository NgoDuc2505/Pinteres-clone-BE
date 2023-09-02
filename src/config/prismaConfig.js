import { PrismaClient } from '@prisma/client'


const config = () => {
    const prisma = new PrismaClient({})
    prisma.$use(async (params, next) => {
        console.log("hi")
        if (params.model == 'users') {
            if (params.action == 'delete') {
                params.action = 'update'
                params.args['data'] = { isDeleted : new Date() }
            }
        }
        return next(params)
    })
    return prisma
}

export default config
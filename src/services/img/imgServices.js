import { PrismaClient } from '@prisma/client';
import compress_images from 'compress-images'
import fs from 'fs'

const prisma = new PrismaClient()

const uploadImg = async (fileName) => {
    await compress_images(`public/image/${fileName}`, 'public/imgStorage/', { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
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

const checkIsValidMimetype = (file) => {
    if (file.destination == "public/delete") {
        fs.unlinkSync(process.cwd() + `/public/delete/${file.filename}`, (err) => { console.log(err) })
        return false
    }
    return true
}

const getCurrentImg = async (imgId) => {
    const result = await prisma.images.findUnique({
        where: {
            image_id: +imgId
        }
    })
    return result
}

export { uploadImg, checkIsValidMimetype, getCurrentImg }